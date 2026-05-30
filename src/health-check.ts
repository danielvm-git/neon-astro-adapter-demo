export interface HealthStatus {
  db: "connected" | "unavailable";
  auth: "configured" | "missing";
}

export async function getHealthStatus(
  authBaseUrl: string | undefined,
  databaseUrl: string | undefined,
): Promise<HealthStatus> {
  const auth: HealthStatus["auth"] = authBaseUrl ? "configured" : "missing";
  let db: HealthStatus["db"] = "unavailable";
  if (databaseUrl) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(databaseUrl);
      await sql`SELECT 1`;
      db = "connected";
    } catch {
      db = "unavailable";
    }
  }
  return { db, auth };
}
