import json
import logging
from contextlib import asynccontextmanager

import redis.asyncio as aioredis
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from config import settings
from publishers.redis import publish_tournaments
from scraper.winamax import WinamaxScraper

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()
redis_client: aioredis.Redis | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global redis_client
    redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    scheduler.add_job(
        _scrape_winamax,
        "interval",
        minutes=5,
        id="winamax_scraper",
        max_instances=1,
    )
    scheduler.start()
    logger.info("Scraper started — polling Winamax every 5 minutes")
    yield
    scheduler.shutdown()
    await redis_client.aclose()


app = FastAPI(title="PokerProGrid Scraper", lifespan=lifespan)


async def _scrape_winamax() -> int:
    scraper = WinamaxScraper()
    try:
        tournaments = await scraper.fetch_tournaments()
        await publish_tournaments(redis_client, tournaments)
        return len(tournaments)
    except Exception as e:
        logger.error(f"Winamax scrape failed: {e}")
        raise


# ── Endpoints ──────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/scrape/winamax", status_code=202)
async def trigger_winamax_scrape():
    """Manually trigger a Winamax scrape (bypasses scheduler)."""
    try:
        count = await _scrape_winamax()
        return {"triggered": True, "tournaments": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/tournaments/winamax")
async def get_winamax_tournaments():
    """Return all cached Winamax tournaments (up to 7 days)."""
    if redis_client is None:
        return {"tournaments": []}
    data = await redis_client.get("winamax:tournaments")
    return {"tournaments": json.loads(data) if data else []}


@app.get("/tournaments/winamax/{date}")
async def get_winamax_tournaments_by_day(date: str):
    """Return cached tournaments for a specific day (YYYY-MM-DD)."""
    if redis_client is None:
        return {"tournaments": []}
    data = await redis_client.get(f"winamax:schedule:{date}")
    if data is None:
        return JSONResponse(
            status_code=404,
            content={"detail": f"No data for {date}"},
        )
    return {"tournaments": json.loads(data)}


@app.get("/status")
async def status():
    """Return scraper health + last update time."""
    if redis_client is None:
        return {"redis": "disconnected"}
    last = await redis_client.get("winamax:last_updated")
    return {
        "redis": "connected",
        "winamax_last_updated": last,
        "scheduler_running": scheduler.running,
    }
