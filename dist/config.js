import { standingsConfig } from "./standings.js";
import { fixturesConfig } from "./fixtures.js";

export const leagueDictionary = {
    "premier_league": 39,
    "bundesliga": 78,
    "la_liga": 140,
    "serie_a": 135,
    "ligue_1": 61,
    "primeira_liga": 94,
    "eredivisie": 88
};

export const urlDictionary = {
    1: standingsConfig,
    2: fixturesConfig,
};

export const globalState = {
    PageKey: 1,
    sel_league_code: 39,  // Default to Premier League
};






