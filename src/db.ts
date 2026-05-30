import { neon } from "@neondatabase/serverless";

let client: ReturnType<typeof neon>;

export async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
) {
  if (!client) {
    const databaseUrl = import.meta.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    client = neon(databaseUrl);
  }
  return client(strings, ...values);
}
