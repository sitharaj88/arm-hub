import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SearchDialog } from '@/components/search-dialog';
import { cn } from '@/lib/utils';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://armhub.dev'),
  title: { default: 'armhub.dev — the modern reference for ARM development', template: '%s · armhub.dev' },
  description:
    'A world-class open reference for ARM developers: architecture, peripherals, RTOSes, toolchains, vendor families, and real-world system designs.',
  openGraph: {
    title: 'armhub.dev',
    description: 'The modern reference for ARM development.',
    type: 'website',
    url: 'https://armhub.dev',
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/favicon.svg` },
  alternates: {
    types: { 'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/rss.xml` },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#0a0a0a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(GeistSans.variable, GeistMono.variable)}>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <SearchDialog />
        </ThemeProvider>
      </body>
    </html>
  );
}
