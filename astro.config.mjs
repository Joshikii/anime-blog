import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // IMPORTANTE: Se usi GitHub Pages con sottocartella
  site: 'https://joshikii.github.io',
  base: "",
  integrations: [react(), tailwind()],
});