'use client';

import { useEffect } from 'react';

/**
 * Wires up click-to-copy on all `.heading-anchor` elements rendered by
 * rehype-autolink-headings. Mounted by DocPage so it runs once per route.
 */
export function AnchorCopy() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest('a.heading-anchor') as HTMLAnchorElement | null;
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      // Update the hash without scroll-jump using replaceState
      try {
        window.history.replaceState(null, '', `${window.location.pathname}${url.hash}`);
      } catch { /* ignore */ }
      e.preventDefault();
      const text = `${window.location.origin}${window.location.pathname}${url.hash}`;
      navigator.clipboard?.writeText(text).then(() => {
        link.setAttribute('data-copied', 'true');
        window.setTimeout(() => link.removeAttribute('data-copied'), 1400);
      }).catch(() => { /* ignore — leave default scroll */ });
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);
  return null;
}
