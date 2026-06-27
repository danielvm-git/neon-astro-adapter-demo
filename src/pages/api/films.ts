import type { APIRoute } from "astro";
import { getFilms } from "../../lib/films";

export const GET: APIRoute = async () => {
  try {
    const films = await getFilms();
    return new Response(JSON.stringify(films), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
};
