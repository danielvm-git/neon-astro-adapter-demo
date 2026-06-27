import { describe, it, expect, vi } from "vitest";

vi.mock("../../../db", () => ({
  sql: vi.fn(),
}));

describe("film detail", () => {
  it("exports getFilm as a function", async () => {
    const mod = await import("../../../lib/films");
    expect(typeof mod.getFilm).toBe("function");
  });

  it("returns film with actors for valid ID", async () => {
    const { sql } = await import("../../../db");
    const mockFilmRows = [
      {
        film_id: 1,
        title: "ACADEMY DINOSAUR",
        release_year: 2006,
        rating: "PG",
        description: "A Epic Drama of a Feminist",
      },
    ];
    const mockActorRows = [
      { actor_id: 1, first_name: "PENELOPE", last_name: "GUINESS" },
    ];
    (sql as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(mockFilmRows)
      .mockResolvedValueOnce(mockActorRows);

    const { getFilm } = await import("../../../lib/films");
    const result = await getFilm(1);

    expect(result).not.toBeNull();
    expect(result!.film_id).toBe(1);
    expect(result!.title).toBe("ACADEMY DINOSAUR");
    expect(result!.actors).toHaveLength(1);
    expect(result!.actors[0].first_name).toBe("PENELOPE");
  });

  it("returns null for nonexistent film ID", async () => {
    const { sql } = await import("../../../db");
    (sql as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const { getFilm } = await import("../../../lib/films");
    const result = await getFilm(99999);

    expect(result).toBeNull();
  });
});
