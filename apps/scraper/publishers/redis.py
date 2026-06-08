"""
Redis publisher for scraped tournaments.

Storage layout:
  winamax:tournaments           → full list JSON (all 7 days)  TTL=6h
  winamax:schedule:YYYY-MM-DD   → day-specific list JSON        TTL=25h
  winamax:last_updated          → ISO timestamp of last scrape

Pub/Sub:
  channel "tournaments:updated" → message "winamax" (signals NestJS)
"""
import json
import logging
from datetime import datetime, timezone

import redis.asyncio as aioredis

logger = logging.getLogger(__name__)

_TTL_ALL = 6 * 3600       # 6 hours for full list
_TTL_DAY = 25 * 3600      # 25 hours per day cache


def _serialize(tournaments: list) -> str:
    return json.dumps(
        [t.model_dump(mode="json") for t in tournaments],
        default=str,
    )


def _group_by_day(tournaments: list) -> dict[str, list]:
    groups: dict[str, list] = {}
    for t in tournaments:
        day = t.start_time.date().isoformat()
        groups.setdefault(day, []).append(t)
    return groups


async def publish_tournaments(
    redis_client: aioredis.Redis,
    tournaments: list,
    room: str = "winamax",
) -> None:
    if not tournaments:
        logger.warning("publish_tournaments: empty list, skipping")
        return

    pipe = redis_client.pipeline()

    # Full list
    pipe.set(f"{room}:tournaments", _serialize(tournaments), ex=_TTL_ALL)

    # Per-day slices
    for day, day_tournaments in _group_by_day(tournaments).items():
        pipe.set(
            f"{room}:schedule:{day}",
            _serialize(day_tournaments),
            ex=_TTL_DAY,
        )

    # Timestamp
    pipe.set(
        f"{room}:last_updated",
        datetime.now(timezone.utc).isoformat(),
        ex=_TTL_ALL,
    )

    await pipe.execute()

    # Notify NestJS subscribers
    await redis_client.publish("tournaments:updated", room)

    logger.info(
        f"Published {len(tournaments)} {room} tournaments "
        f"across {len(_group_by_day(tournaments))} days"
    )
