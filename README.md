# Neon Auth + Astro Demo

> A reference implementation showing how to integrate **[Neon Auth](https://neon.com)** and **[Neon DB](https://neon.com)** into an **[Astro](https://astro.build)** application.

**[Live Demo](https://neon-astro-demo.netlify.app)** · **[Adapter Repo](https://github.com/danielvm-git/neon-astro-adapter)**

[![Netlify Status](https://api.netlify.com/api/v1/badges/00000000-0000-0000-0000-000000000000/deploy-status)](https://app.netlify.com/sites/neon-astro-demo/deploys)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

---

## Features

- Email/password authentication (sign up, sign in, sign out)
- Server-side protected routes (SSR middleware)
- Client-side session access (`getSession()` in browser)
- Neon DB integration with the [DVD Rental](https://neon.com/postgresql/getting-started/sample-database) sample database
- Protected API endpoints
- Graceful error handling (auth failure, DB timeout)
- Deployed live on Netlify

## Prerequisites

- **Node.js** >= 22
- A **[Neon](https://neon.com)** account with:
  - A project with **Neon Auth** enabled
  - The **DVD Rental** sample database loaded
- An email/password auth provider configured in Neon Auth

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/danielvm-git/neon-astro-adapter-demo.git
cd neon-astro-adapter-demo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your Neon project values:

```env
NEON_AUTH_BASE_URL=https://your-project.neon.tech/api/auth
NEON_AUTH_COOKIE_SECRET=your-cookie-secret-here
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Project Structure

```
src/
  pages/
    index.astro           Home + film catalog
    login.astro           Sign-in form
    signup.astro          Registration form
    dashboard.astro       Protected SSR + DB film list
    profile.astro         Client-side session display
    films/
      [id].astro          Film detail with actors
    api/
      films.ts            Protected JSON API endpoint
      reviews.ts          Protected POST endpoint
  layouts/
    Layout.astro          Shared layout with auth-aware nav
  middleware.ts            Auth proxy + session validation
  db.ts                    Neon serverless DB client
  auth-client.ts           Browser-side auth helper
  env.d.ts                 Environment type declarations
e2e/                       Playwright E2E tests
specs/                     Planning documents
```

## Pages

| Route           | Auth Required | Description                          |
|-----------------|---------------|--------------------------------------|
| `/`             | No            | Home page with film catalog          |
| `/login`        | No            | Email/password sign-in               |
| `/signup`       | No            | New account registration             |
| `/dashboard`    | Yes (SSR)     | Protected page with DB film list     |
| `/films/[id]`   | Yes (SSR)     | Film detail with actor information   |
| `/profile`      | Yes (client)  | Client-side session data             |
| `GET /api/films`| Yes (handler) | JSON film list from Neon DB          |
| `POST /api/reviews` | Yes (handler) | Create a review (DB write)       |

## How It Works

This demo uses **[`@danielvm/neon-astro-auth`](https://github.com/danielvm-git/neon-astro-adapter)**, an Astro adapter for Neon Auth. The adapter provides:

1. **`neonAuth()` integration** — auto-wires auth route handler and middleware into Astro
2. **`createAstroAuth()`** — server-side auth with middleware and handler
3. **`createAuthClient()`** — browser-side auth client for login, signup, and session access

### astro.config.mjs

```js
import netlify from "@astrojs/netlify";
import { neonAuth } from "@danielvm/neon-astro-auth";

export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: [neonAuth()],
});
```

### Middleware

```ts
import { createAstroAuth } from "@danielvm/neon-astro-auth/server";

export const onRequest = createAstroAuth({
  baseUrl: import.meta.env.NEON_AUTH_BASE_URL,
  cookieSecret: import.meta.env.NEON_AUTH_COOKIE_SECRET,
  skipRoutes: ["/", "/login", "/signup"],
}).middleware();
```

### Client Auth

```ts
import { createAuthClient } from "@danielvm/neon-astro-auth";

const auth = createAuthClient(import.meta.env.NEON_AUTH_BASE_URL);

await auth.signIn.email({ email, password });
const { data } = auth.getSession();
```

## Deployment

This demo is deployed on **Netlify** with SSR via `@astrojs/netlify`.

### 1. Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### 2. Configure environment variables

In your Netlify site dashboard, add:
- `NEON_AUTH_BASE_URL`
- `NEON_AUTH_COOKIE_SECRET`
- `DATABASE_URL`

## Running Tests

```bash
npm test              # Vitest unit tests
npm run test:e2e      # Playwright E2E (local)
npx playwright test --project=live  # E2E against deployed URL
```

## Built With

- [Astro](https://astro.build) — Web framework
- [Neon](https://neon.com) — Serverless Postgres + Auth
- [@danielvm/neon-astro-auth](https://github.com/danielvm-git/neon-astro-adapter) — Neon Auth Astro adapter
- [@neondatabase/serverless](https://github.com/neondatabase/serverless) — Neon DB driver
- [@astrojs/netlify](https://docs.astro.build/en/guides/integrations-guide/netlify/) — Netlify adapter
- [Playwright](https://playwright.dev) — E2E testing
- [Vitest](https://vitest.dev) — Unit testing
- [Semantic Release](https://semantic-release.gitbook.io) — Automated versioning

## Contributing

This is a reference demo. For bugs or feature requests related to the adapter, open an issue on the [adapter repo](https://github.com/danielvm-git/neon-astro-adapter).

## License

Apache-2.0 © [Daniel Valdez](https://github.com/danielvm-git)
