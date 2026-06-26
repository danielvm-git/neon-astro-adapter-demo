import { sql } from "../db";

export interface Film {
  film_id: number;
  title: string;
  release_year: number;
  rating: string;
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
