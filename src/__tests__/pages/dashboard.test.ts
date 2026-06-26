import { describe, it, expect, vi } from "vitest";

vi.mock("../../db", () => ({
  sql: vi.fn(),
}));

describe("dashboard film list", () => {
  it("exports getFilms as a function", async () => {
    const mod = await import("../../lib/films");
    expect(typeof mod.getFilms).toBe("function");
  });

  it("returns an array of films with expected shape", async () => {
    const { sql } = await import("../../db");
    const mockRows = [
      { film_id: 1, title: "ACADEMY DINOSAUR", release_year: 2006, rating: "PG" },
    ];
    (sql as ReturnType<typeof vi.fn>).mockResolvedValue(mockRows);

    const { getFilms } = await import("../../lib/films");
    const result = await getFilms();

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("film_id", 1);
    expect(result[0]).toHaveProperty("title", "ACADEMY DINOSAUR");
  });

  it("returns empty array when no films exist", async () => {
    const { sql } = await import("../../db");
    (sql as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const { getFilms } = await import("../../lib/films");
    const result = await getFilms();

    expect(result).toEqual([]);
  });
});
