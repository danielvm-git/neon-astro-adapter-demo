import { describe, it, expect, vi } from "vitest";

vi.mock("../../../lib/films", () => ({
  getFilms: vi.fn(),
}));

describe("films API endpoint", () => {
  it("returns JSON with film array", async () => {
    const { getFilms } = await import("../../../lib/films");
    const mockFilms = [
      { film_id: 1, title: "ACADEMY DINOSAUR", release_year: 2006, rating: "PG" },
    ];
    (getFilms as ReturnType<typeof vi.fn>).mockResolvedValue(mockFilms);

    const mod = await import("../../../pages/api/films");
    const response = await mod.GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("ACADEMY DINOSAUR");
  });

  it("returns empty array when no films", async () => {
    const { getFilms } = await import("../../../lib/films");
    (getFilms as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const mod = await import("../../../pages/api/films");
    const response = await mod.GET();
    const data = await response.json();

    expect(data).toEqual([]);
  });
});
