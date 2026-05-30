import { createAstroAuth } from "@danielvm/neon-astro-auth/server";

export const onRequest = createAstroAuth({
  baseUrl: import.meta.env.NEON_AUTH_BASE_URL,
  cookies: {
    secret: import.meta.env.NEON_AUTH_COOKIE_SECRET,
  },
  skipRoutes: ["/", "/login", "/signup"],
}).middleware();
