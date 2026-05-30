import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import "dotenv/config";

export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: [
    {
      name: "neon-auth-route-handler",
      hooks: {
        "astro:config:setup": ({ injectRoute }) => {
          injectRoute({
            pattern: "/api/auth/[...slug]",
            entrypoint: "@danielvm/neon-astro-auth/route-handler",
            prerender: false,
          });
        },
      },
    },
  ],
});
