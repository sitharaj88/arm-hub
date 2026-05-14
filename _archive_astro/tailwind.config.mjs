import typography from '@tailwindcss/typography';

const cv = (name) => `hsl(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: cv('bg'),
          subtle: cv('bg-subtle'),
          raised: cv('bg-raised'),
        },
        surface: {
          DEFAULT: cv('surface'),
          hover: cv('surface-hover'),
        },
        line: {
          DEFAULT: cv('line'),
          subtle: cv('line-subtle'),
          strong: cv('line-strong'),
        },
        ink: {
          DEFAULT: cv('ink'),
          muted: cv('ink-muted'),
          faint: cv('ink-faint'),
        },
        brand: {
          DEFAULT: cv('brand'),
          soft: cv('brand-soft'),
          deep: cv('brand-deep'),
        },
        accent: {
          DEFAULT: cv('accent'),
          soft: cv('accent-soft'),
        },
        ok: cv('ok'),
        warn: cv('warn'),
        err: cv('err'),
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px hsl(var(--brand) / 0.35), 0 0 40px -8px hsl(var(--brand) / 0.35)',
        panel: 'var(--shadow-panel)',
        card: 'var(--shadow-card)',
      },
      backgroundImage: {
        'grid-lines': 'linear-gradient(to right, hsl(var(--line) / 0.6) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--line) / 0.6) 1px, transparent 1px)',
        'radial-fade': 'radial-gradient(ellipse 80% 60% at 50% -10%, var(--radial-fade-color), transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'caret-blink': 'caret 1.1s steps(2) infinite',
        'gradient-shift': 'gradient 8s ease infinite',
      },
      keyframes: {
        caret: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body':       'hsl(var(--ink))',
            '--tw-prose-headings':   'hsl(var(--ink))',
            '--tw-prose-links':      'hsl(var(--brand))',
            '--tw-prose-bold':       'hsl(var(--ink))',
            '--tw-prose-counters':   'hsl(var(--ink-muted))',
            '--tw-prose-bullets':    'hsl(var(--line-strong))',
            '--tw-prose-hr':         'hsl(var(--line))',
            '--tw-prose-quotes':     'hsl(var(--ink-muted))',
            '--tw-prose-code':       'hsl(var(--brand-deep))',
            '--tw-prose-pre-bg':     'transparent',
            '--tw-prose-th-borders': 'hsl(var(--line))',
            '--tw-prose-td-borders': 'hsl(var(--line-subtle))',
            // dark theme overrides happen via the same CSS variables — no need to set --tw-prose-invert-*
          },
        },
      }),
    },
  },
  plugins: [typography],
};
