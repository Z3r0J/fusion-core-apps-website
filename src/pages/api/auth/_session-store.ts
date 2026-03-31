// Module-level token store (resets on cold start — acceptable for simple admin)
export const validSessions = new Set<string>();
