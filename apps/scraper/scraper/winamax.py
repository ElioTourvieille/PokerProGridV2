from playwright.async_api import async_playwright
from pydantic import BaseModel
from datetime import datetime
from enum import Enum
import httpx
import logging

logger = logging.getLogger(__name__)

WINAMAX_TOURNAMENTS_API = "https://www.winamax.fr/apiv2/tournaments"


class TournamentType(str, Enum):
    CLASSIC = "CLASSIC"
    KNOCKOUT = "KNOCKOUT"
    PROGRESSIVE_KNOCKOUT = "PROGRESSIVE_KNOCKOUT"
    FLIGHT = "FLIGHT"


class TournamentStructure(str, Enum):
    NORMAL = "NORMAL"
    DEEP_STACK = "DEEP_STACK"
    TURBO = "TURBO"
    HYPER_TURBO = "HYPER_TURBO"


class ScrapedTournament(BaseModel):
    external_id: str
    room: str = "WINAMAX"
    name: str
    type: TournamentType
    structure: TournamentStructure
    buy_in: float
    rake: float
    guaranteed: float
    start_time: datetime
    late_reg_ends_at: datetime | None
    max_players: int | None
    registered_players: int
    status: str


class WinamaxScraper:
    async def fetch_tournaments(self) -> list[ScrapedTournament]:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(WINAMAX_TOURNAMENTS_API)
            response.raise_for_status()
            data = response.json()
        return self._parse(data)

    def _parse(self, data: dict) -> list[ScrapedTournament]:
        tournaments = []
        for item in data.get("tournaments", []):
            try:
                tournament = self._parse_item(item)
                if tournament:
                    tournaments.append(tournament)
            except Exception as e:
                logger.warning(f"Failed to parse tournament {item.get('id')}: {e}")
        return tournaments

    def _parse_item(self, item: dict) -> ScrapedTournament | None:
        speed = item.get("speed", "normal").upper()
        structure_map = {
            "NORMAL": TournamentStructure.NORMAL,
            "DEEPSTACK": TournamentStructure.DEEP_STACK,
            "DEEP": TournamentStructure.DEEP_STACK,
            "TURBO": TournamentStructure.TURBO,
            "HYPER": TournamentStructure.HYPER_TURBO,
            "HYPERTURBO": TournamentStructure.HYPER_TURBO,
        }
        kind = item.get("type", "").upper()
        type_map = {
            "CLASSIC": TournamentType.CLASSIC,
            "FREEZEOUT": TournamentType.CLASSIC,
            "KO": TournamentType.KNOCKOUT,
            "KNOCKOUT": TournamentType.KNOCKOUT,
            "PKO": TournamentType.PROGRESSIVE_KNOCKOUT,
            "PROGRESSIVEKNOCKOUT": TournamentType.PROGRESSIVE_KNOCKOUT,
            "FLIGHT": TournamentType.FLIGHT,
        }
        return ScrapedTournament(
            external_id=str(item["id"]),
            name=item["name"],
            type=type_map.get(kind, TournamentType.CLASSIC),
            structure=structure_map.get(speed, TournamentStructure.NORMAL),
            buy_in=float(item.get("buyIn", 0)) / 100,
            rake=float(item.get("fee", 0)) / 100,
            guaranteed=float(item.get("prizepool", {}).get("guaranteed", 0)) / 100,
            start_time=datetime.fromtimestamp(item["startDate"]),
            late_reg_ends_at=datetime.fromtimestamp(item["lateRegistrationDate"])
            if item.get("lateRegistrationDate")
            else None,
            max_players=item.get("maxPlayers"),
            registered_players=item.get("registeredPlayers", 0),
            status=item.get("status", "UPCOMING").upper(),
        )
