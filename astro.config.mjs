import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import { neonAuth } from "@danielvm/neon-astro-auth";

export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: [neonAuth()],
});
