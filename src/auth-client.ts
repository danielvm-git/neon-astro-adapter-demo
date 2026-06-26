import { createAuthClient } from "@neondatabase/auth";

const baseUrl = import.meta.env.NEON_AUTH_BASE_URL;

if (!baseUrl) {
  throw new Error(
    "NEON_AUTH_BASE_URL environment variable is required for auth operations",
  );
}

export const authClient = createAuthClient(baseUrl);
