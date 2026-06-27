import { sql } from "../db";

export interface Film {
  film_id: number;
  title: string;
  release_year: number;
  rating: string;
}

export interface Actor {
  actor_id: number;
  first_name: string;
  last_name: string;
}

export interface FilmDetail extends Film {
  description: string;
  actors: Actor[];
}

export async function getFilms(limit = 20): Promise<Film[]> {
  try {
    const rows = (await sql`
      SELECT film_id, title, release_year, rating
      FROM film
      ORDER BY title
      LIMIT ${limit}
    `) as Film[];
    return rows;
  } catch {
    return [];
  }
}

export async function getFilm(id: number): Promise<FilmDetail | null> {
  try {
    const filmRows = (await sql`
      SELECT film_id, title, description, release_year, rating
      FROM film
      WHERE film_id = ${id}
    `) as (FilmDetail & { description: string })[];
    if (filmRows.length === 0) return null;

    const film = filmRows[0];
    const actorRows = (await sql`
      SELECT a.actor_id, a.first_name, a.last_name
      FROM actor a
      JOIN film_actor fa ON a.actor_id = fa.actor_id
      WHERE fa.film_id = ${id}
      ORDER BY a.last_name, a.first_name
    `) as Actor[];

    return { ...film, actors: actorRows };
  } catch {
    return null;
  }
}
