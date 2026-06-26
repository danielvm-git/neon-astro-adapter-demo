import { sql } from "../db";

export interface Film {
  film_id: number;
  title: string;
  release_year: number;
  rating: string;
}

export async function getFilms(limit = 20): Promise<Film[]> {
  const rows = await sql<Film[]>`
    SELECT film_id, title, release_year, rating
    FROM film
    ORDER BY title
    LIMIT ${limit}
  `;
  return rows;
}
