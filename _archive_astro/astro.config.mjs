import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://armhub.dev',
  integrations: [
    mdx(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      wrap: false,
      langAlias: {
        ld: 'js',          // GNU ld scripts — close enough syntactically
        dts: 'js',         // device tree — close enough for our highlighting
        asm: 'armasm',
      },
    },
  },
});
