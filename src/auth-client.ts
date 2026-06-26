import { createAuthClient } from "@neondatabase/auth";

let _client: ReturnType<typeof createAuthClient> | null = null;

export function getAuthClient(baseUrlOverride?: string) {
  if (!_client) {
    const baseUrl = baseUrlOverride ?? import.meta.env.NEON_AUTH_BASE_URL;
    if (!baseUrl) {
      throw new Error(
        "NEON_AUTH_BASE_URL environment variable is required for auth operations",
      );
    }
    _client = createAuthClient(baseUrl);
  }
  return _client;
}
