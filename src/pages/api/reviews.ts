import type { APIRoute } from "astro";
import { sql } from "../../db";

const SESSION_COOKIE = "__Secure-neon-auth.session_token";

async function getUserId(
  baseUrl: string,
  cookieHeader: string,
): Promise<string | null> {
  if (!baseUrl || !cookieHeader.includes(SESSION_COOKIE)) return null;

  try {
    const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/get-session`, {
      headers: { cookie: cookieHeader },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;

    const data: { user?: { id?: string } } = await response.json();
    return data?.user?.id ?? null;
  } catch {
    return null;
  }
}

export const POST: APIRoute = async ({ request }) => {
  const baseUrl = import.meta.env.NEON_AUTH_BASE_URL;
  if (!baseUrl) {
    return new Response(
      JSON.stringify({ error: "Auth service not configured" }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  const userId = await getUserId(baseUrl, request.headers.get("cookie") || "");
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Not authenticated" }),
      { status: 401, headers: { "content-type": "application/json" } },
    );
  }

  try {
    const body = await request.json() as {
      film_id?: number;
      rating?: number;
      content?: string;
    };

    const filmId = Number(body.film_id);
    const rating = Number(body.rating);

    if (!Number.isFinite(filmId) || filmId < 1) {
      return new Response(
        JSON.stringify({ error: "Invalid film_id" }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: "Rating must be 1-5" }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    const content = typeof body.content === "string" ? body.content.slice(0, 1000) : "";

    const result = (await sql`
      INSERT INTO reviews (film_id, user_id, rating, content)
      VALUES (${filmId}, ${userId}, ${rating}, ${content})
      RETURNING id
    `) as Array<{ id: number }>;

    return new Response(
      JSON.stringify({ id: result[0]?.id, film_id: filmId, rating, content }),
      { status: 201, headers: { "content-type": "application/json" } },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
};
