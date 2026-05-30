import type { APIRoute } from "astro";
import { getHealthStatus } from "../../health-check";

export const GET: APIRoute = async () => {
  const health = await getHealthStatus(
    import.meta.env.NEON_AUTH_BASE_URL,
    import.meta.env.DATABASE_URL,
  );

  return new Response(JSON.stringify(health, null, 2), {
    status: health.db === "connected" ? 200 : 503,
    headers: { "content-type": "application/json" },
  });
};
