/**
 * @doughmination/react-api/server
 *
 * Server-safe entry point: the typed client, its error type and the shared
 * types — with none of the React provider, context or hooks.
 *
 * The main entry (".") re-exports the provider, so importing anything from it
 * evaluates `createContext`, which throws inside a React Server Component. This
 * entry lets server code (Next.js `generateMetadata`, route handlers, scripts)
 * use the client without pulling in any client-only code.
 */

// ---- Client ----------------------------------------------------------------
export { DoughminationClient, DEFAULT_BASE_URL } from "./client/http";
export type {
  DoughminationClientOptions,
  TokenSource,
} from "./client/http";
export { DoughminationError, isDoughminationError } from "./client/errors";

// ---- Hypixel helpers (pure functions, no React) ----------------------------
export {
  getHypixelRank,
  getNetworkLevel,
  getPlayerSummary,
  getSkyblockProfiles,
  getSelectedSkyblockProfile,
} from "./client/hypixel";
export type {
  HypixelPlayerSummary,
  SkyblockProfileSummary,
} from "./client/hypixel";

// ---- Types -----------------------------------------------------------------
export * from "./types";
export { isDeviceDeleted } from "./types/devices";
export {
  GUESTBOOK_LIMITS,
  GUESTBOOK_RATE_LIMIT_SECONDS,
} from "./types/guestbook";
