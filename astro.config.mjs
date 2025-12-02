import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // IMPORTANTE: Se usi GitHub Pages con sottocartella
  site: 'https://www.animefocus.me',
  base: "",
  integrations: [react(), tailwind(), sitemap()],
});