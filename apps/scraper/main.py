from fastapi import FastAPI
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from scraper.winamax import WinamaxScraper
from config import settings
import redis.asyncio as aioredis
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()
redis_client: aioredis.Redis | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global redis_client
    redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    scheduler.add_job(scrape_winamax, "interval", minutes=5, id="winamax_scraper")
    scheduler.start()
    logger.info("Scraper started — polling Winamax every 5 minutes")
    yield
    scheduler.shutdown()
    await redis_client.aclose()


app = FastAPI(title="PokerProGrid Scraper", lifespan=lifespan)


async def scrape_winamax():
    scraper = WinamaxScraper()
    try:
        tournaments = await scraper.fetch_tournaments()
        await redis_client.set(
            "tournaments:winamax",
            json.dumps([t.model_dump(mode="json") for t in tournaments]),
            ex=360,
        )
        logger.info(f"Winamax: cached {len(tournaments)} tournaments")
    except Exception as e:
        logger.error(f"Winamax scrape failed: {e}")


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/tournaments/winamax")
async def get_winamax_tournaments():
    if redis_client is None:
        return {"tournaments": []}
    data = await redis_client.get("tournaments:winamax")
    return {"tournaments": json.loads(data) if data else []}
