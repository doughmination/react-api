/**
 * Genshin hooks. Public read, no auth configuration needed.
 *
 * `uid` is the in-game numeric player ID (Settings > Account in Genshin),
 * not a Discord id or Enka username.
 */

import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import { useDoughminationClient } from "../provider/context";
import { queryKeys } from "./keys";
import type { QueryOptionsFor } from "./discord";
import type { DoughminationError } from "../client/errors";
import type { UnifiedGenshinRoster } from "../types/genshin";

/**
 * Every playable character for a Genshin UID, merged against a live
 * Enka.Network lookup: owned/not-owned + level.
 *
 * Check `data.partial` before trusting `owned`/`level` as the whole account —
 * it's `true` when the player hasn't enabled "Display all your characters"
 * on their in-game Character Showcase, in which case Enka (and this hook)
 * only sees their pinned showcase, not their full roster.
 *
 * ```tsx
 * const { data } = useGenshinRoster("691386457");
 * if (data?.partial) {
 *   // prompt: enable "Display all your characters" in-game for full tracking
 * }
 * const owned = data?.characters.filter((c) => c.owned) ?? [];
 * ```
 */
export function useGenshinRoster(
  uid: string | null | undefined,
  options?: QueryOptionsFor<UnifiedGenshinRoster>,
): UseQueryResult<UnifiedGenshinRoster, DoughminationError> {
  const client = useDoughminationClient();

  return useQuery({
    queryKey: queryKeys.genshin.roster(uid ?? ""),
    queryFn: ({ signal }) => client.getGenshinRoster(uid as string, signal),
    enabled: Boolean(uid) && (options?.enabled ?? true),
    // The API itself caches per-UID using Enka's own `ttl` (as low as ~30s
    // right after a showcase refresh), so there's little value refetching
    // more often than that from the client side too.
    staleTime: 30 * 1000,
    ...options,
  });
}