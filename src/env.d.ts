interface ImportMetaEnv {
  readonly NEON_AUTH_BASE_URL: string;
  readonly NEON_AUTH_COOKIE_SECRET: string;
  readonly DATABASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
