"""
Winamax tournament scraper — fetches les-tournois_planning and extracts
the embedded $tournaments JSON object (no auth required).
"""
import json
import logging
import re
from datetime import datetime

from playwright.async_api import async_playwright
from pydantic import BaseModel

from normalizers.winamax import normalize_all

logger = logging.getLogger(__name__)

PLANNING_URL = "https://www.winamax.fr/les-tournois_planning"
_MARKER = "$tournaments = {\""


class ScrapedTournament(BaseModel):
    external_id: str
    room: str = "WINAMAX"
    name: str
    type: str
    structure: str
    buy_in: float
    rake: float = 0.0
    guaranteed: float = 0.0
    start_time: datetime
    late_reg_ends_at: datetime | None = None
    max_players: int | None = None
    registered_players: int = 0
    status: str = "UPCOMING"


class WinamaxScraper:
    async def fetch_tournaments(self) -> list[ScrapedTournament]:
        html = await self._fetch_html()
        raw_data = self._extract_json(html)
        if not raw_data:
            logger.warning("No $tournaments JSON found in planning page HTML")
            return []
        tournaments = normalize_all(raw_data)
        logger.info(f"Scraped {len(tournaments)} Winamax tournaments")
        return tournaments

    async def _fetch_html(self) -> str:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(locale="fr-FR")
            page = await context.new_page()
            try:
                await page.goto(PLANNING_URL, timeout=30000)
                await page.wait_for_timeout(2000)
                return await page.content()
            finally:
                await browser.close()

    def _extract_json(self, html: str) -> dict:
        idx = html.find(_MARKER)
        if idx < 0:
            return {}
        brace_start = html.find("{", idx + len("$tournaments = "))
        if brace_start < 0:
            return {}
        try:
            obj, _ = json.JSONDecoder().raw_decode(html, idx=brace_start)
            return obj
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode $tournaments JSON: {e}")
            return {}
