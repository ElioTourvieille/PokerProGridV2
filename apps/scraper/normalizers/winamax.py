"""
Normalize raw Winamax planning data into ScrapedTournament objects.

Source data shape per entry:
  {"id": "1108173318", "time": "20:15", "name": "ANDROMEDA", "buyin": "50€"}

Slot key format: "YYYY-MM-DD-HH"
"""
import re
from datetime import datetime


# -- Buy-in parsing ----------------------------------------------------------

_BUYIN_RE = re.compile(r"([\d]+(?:[,\.]\d+)?)")


def parse_buyin(raw: str) -> float:
    """'50€' -> 50.0 | '0,25 €' -> 0.25 | '0€' -> 0.0"""
    m = _BUYIN_RE.search(raw.replace(" ", ""))
    if not m:
        return 0.0
    return float(m.group(1).replace(",", "."))


# -- Max players from name ---------------------------------------------------

_MAX_PLAYERS_RE = re.compile(r"\[(\d+)\s*(?:max|Max)?\]", re.IGNORECASE)


def parse_max_players(name: str) -> int | None:
    m = _MAX_PLAYERS_RE.search(name)
    return int(m.group(1)) if m else None


# -- Type detection from name ------------------------------------------------

_PKO_KEYWORDS = {"PKO", "PROGRESSIVE KO", "PROG KO", "BOUNTY PROGRESSIVE"}
_KO_KEYWORDS = {
    "KO",
    "KNOCKOUT",
    "BOUNTY",
    "MYSTERY KO",
    "TRIDENT",
}
_FLIGHT_KEYWORDS = {"FLIGHT", "VOL "}


def detect_type(name: str) -> str:
    upper = name.upper()
    if any(k in upper for k in _PKO_KEYWORDS):
        return "PROGRESSIVE_KNOCKOUT"
    if any(k in upper for k in _KO_KEYWORDS):
        return "KNOCKOUT"
    if any(k in upper for k in _FLIGHT_KEYWORDS):
        return "FLIGHT"
    return "CLASSIC"


# -- Structure detection from name -------------------------------------------

_HYPER_KEYWORDS = {"HYPER"}
_TURBO_KEYWORDS = {"TURBO"}
_DEEP_KEYWORDS = {"DEEP", "DEEPSTACK", "MONSTER STACK", "DEEP STACK"}


def detect_structure(name: str) -> str:
    upper = name.upper()
    if any(k in upper for k in _HYPER_KEYWORDS):
        return "HYPER_TURBO"
    if any(k in upper for k in _TURBO_KEYWORDS):
        return "TURBO"
    if any(k in upper for k in _DEEP_KEYWORDS):
        return "DEEP_STACK"
    return "NORMAL"


# -- Slot key -> date --------------------------------------------------------

def slot_key_to_date(slot_key: str) -> datetime:
    """'2026-06-08-20' -> datetime(2026, 6, 8, 20, 0)"""
    parts = slot_key.rsplit("-", 1)
    return datetime.fromisoformat(parts[0]).replace(hour=int(parts[1]))


# -- Normalize a single entry ------------------------------------------------

def normalize(slot_key: str, raw: dict) -> dict:
    base_date = slot_key_to_date(slot_key)
    h, m = raw["time"].split(":")
    start_time = base_date.replace(hour=int(h), minute=int(m))

    return {
        "external_id": raw["id"],
        "room": "WINAMAX",
        "name": raw["name"],
        "type": detect_type(raw["name"]),
        "structure": detect_structure(raw["name"]),
        "buy_in": parse_buyin(raw["buyin"]),
        "rake": 0.0,
        "guaranteed": 0.0,
        "start_time": start_time,
        "late_reg_ends_at": None,
        "max_players": parse_max_players(raw["name"]),
        "registered_players": 0,
        "status": "UPCOMING",
    }


# -- Normalize full planning payload -----------------------------------------

def normalize_all(tournaments_data: dict) -> list:
    """
    tournaments_data: {"2026-06-08-00": [{id, time, name, buyin}, ...], ...}
    Returns list of ScrapedTournament dicts (import ScrapedTournament from
    scraper.winamax to validate with Pydantic if needed).
    """
    from scraper.winamax import ScrapedTournament

    results = []
    for slot_key, entries in tournaments_data.items():
        for raw in entries:
            try:
                results.append(ScrapedTournament(**normalize(slot_key, raw)))
            except Exception:
                pass
    return results
