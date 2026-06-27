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
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Database query timed out")), 5000);
  });

  try {
    return await Promise.race([
      client(strings, ...values),
      timeoutPromise,
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
