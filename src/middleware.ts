import { createAstroAuth } from "@danielvm/neon-astro-auth/server";
import type { APIContext } from "astro";
import { createRequestLogger } from "./lib/logger";
import crypto from "node:crypto";

const authMiddleware = createAstroAuth({
  baseUrl: import.meta.env.NEON_AUTH_BASE_URL,
  cookies: {
    secret: import.meta.env.NEON_AUTH_COOKIE_SECRET,
  },
  skipRoutes: ["/", "/login", "/signup", "/api/health"],
}).middleware();

export const onRequest = async (
  ctx: APIContext,
  next: () => Promise<Response>,
): Promise<Response> => {
  const requestId = crypto.randomUUID();
  const log = createRequestLogger(requestId);
  const start = performance.now();

  log.info({ method: ctx.request.method, url: ctx.url.pathname }, "request");

  try {
    const response = await authMiddleware(ctx, next);
    const duration = ((performance.now() - start) / 1000).toFixed(3);

    log.info(
      { status: response.status, duration: `${duration}s` },
      "response",
    );
    return response;
  } catch (error) {
    const duration = ((performance.now() - start) / 1000).toFixed(3);
    log.error({ err: error, duration: `${duration}s` }, "request failed");
    throw error;
  }
};
