/**
 * Genshin types — transcribed from the API's `src/types.ts` and
 * `src/genshin.ts`.
 *
 *   GET /v2/genshin/roster/:uid  -> { success, data: UnifiedGenshinRoster }
 *
 * Data comes from Enka.Network's live UID lookup, merged against a cached
 * character catalog (names/elements/icons), then unioned with the API's
 * persistent ownership ledger so nothing seen owned is ever lost. Each
 * character carries `tracked` (present in the live Enka data) alongside
 * `owned`; the roster carries `stale` (served entirely from the ledger
 * because Enka was unavailable). See those fields before treating
 * `owned`/`level` as a complete, live picture of the account.
 */

/** One playable character, joined against the requested UID's owned roster. */
export interface UnifiedGenshinCharacter {
  /** Enka/game avatarId, as a string. */
  id: string;
  name: string;
  /** Localized element name, e.g. "Pyro", "Cryo", "Dendro". */
  element: string;
  /** 4 or 5. */
  rarity: number;
  icon_url: string;
  owned: boolean;
  /** Character level, or null if not owned. */
  level: number | null;
  /**
   * True when this character is in the CURRENT live Enka response (pinned
   * showcase, or full roster with "Display all" on). False when it's known
   * only from the API's persistent ownership ledger — i.e. it was seen owned
   * before but has since dropped out of Enka (unpinned from the showcase,
   * "Display all" turned off, or the profile went private). Such a character
   * is still `owned: true`; it just isn't tracked live anymore, so `level` is
   * the last value ever seen. Always false when `owned` is false.
   *
   * Use this to tell "owned, live level" from "owned, last-known level" in the
   * UI — e.g. a subtler badge for untracked characters.
   */
  tracked: boolean;
  /** Epoch ms of the last time this character was seen in a live Enka
   *  response, or null if never seen live (i.e. not owned). */
  last_seen: number | null;
}

/** GET /v2/genshin/roster/:uid */
export interface UnifiedGenshinRoster {
  uid: string;
  nickname: string | null;
  player_level: number | null;
  /**
   * True when Enka only returned the player's pinned Character Showcase
   * (at most 8 characters) rather than their full roster. This happens when
   * the player hasn't enabled "Display all your characters" in-game — until
   * they do, `owned`/`level` below are only accurate for the characters
   * they've pinned, not their whole account. Surface this in the UI rather
   * than silently rendering an incomplete "not owned" list.
   */
  partial: boolean;
  /**
   * True when this WHOLE response was served from the persistent ownership
   * ledger because the live Enka fetch failed (profile private, UID
   * unindexed, or Enka upstream down). Every character is then `tracked:
   * false` with last-known levels. When false, the ledger was merged with
   * fresh live data as normal. Show a "live data temporarily unavailable"
   * hint when true.
   */
  stale: boolean;
  owned_count: number;
  /** Of the owned characters, how many are currently tracked live (present in
   *  the Enka response). `owned_count - tracked_count` = owned-but-untracked. */
  tracked_count: number;
  total_count: number;
  characters: UnifiedGenshinCharacter[];
  updated_at: number;
}

/** One stat line — a weapon's base stat/substat, or an artifact's main/substat. */
export interface UnifiedGenshinStat {
  /** e.g. "CRIT Rate", "ATK%", "Elemental Mastery". */
  name: string;
  /** Already a percentage number (e.g. 46.6) for percent stats, not 0-1. */
  value: number;
  is_percent: boolean;
}

export interface UnifiedGenshinWeapon {
  id: string;
  name: string;
  /** 1-5. */
  rarity: number;
  level: number;
  /** Ascension phase, 0-6. */
  ascension: number;
  /** Refinement rank, 1-5. */
  refinement: number;
  base_stat: UnifiedGenshinStat | null;
  sub_stat: UnifiedGenshinStat | null;
  icon_url: string;
}

export type UnifiedGenshinArtifactSlot = "flower" | "plume" | "sands" | "goblet" | "circlet";

export interface UnifiedGenshinArtifact {
  id: string;
  name: string;
  set_name: string;
  slot: UnifiedGenshinArtifactSlot;
  /** 1-5. */
  rarity: number;
  /** Display level (the "+N" shown in-game). */
  level: number;
  main_stat: UnifiedGenshinStat | null;
  sub_stats: UnifiedGenshinStat[];
  icon_url: string;
}

/**
 * GET /v2/genshin/roster/:uid/:heroId — full detail for one character.
 *
 * Note: even for an owned, "Display all"-enabled account, `weapon`/
 * `artifacts` can come back empty for a character that isn't currently
 * sitting in the player's in-game Character Showcase (~8 slots max) — that's
 * an Enka/game limitation, not a sign of missing gear.
 */
export interface UnifiedGenshinCharacterDetail extends UnifiedGenshinCharacter {
  /** 0-6. 0 if not owned or no constellations unlocked. */
  constellation: number;
  /** In-game friendship/fetter level, 1-10. Null if not owned. */
  friendship: number | null;
  weapon: UnifiedGenshinWeapon | null;
  artifacts: UnifiedGenshinArtifact[];
  updated_at: number;
}

/** GET /v2/genshin/roster/:uid/:heroId/items */
export interface UnifiedGenshinCharacterItems {
  weapon: UnifiedGenshinWeapon | null;
  artifacts: UnifiedGenshinArtifact[];
}

/** GET /v2/genshin/roster/:uid/:heroId/constellations */
export interface UnifiedGenshinCharacterConstellations {
  constellation: number;
  /** Raw unlocked talent ids from Enka, in unlock order. Length == constellation. */
  unlocked_talent_ids: number[];
  friendship: number | null;
}