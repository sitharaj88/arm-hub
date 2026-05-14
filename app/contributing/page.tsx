export const metadata = {
  title: 'Contributing — armhub',
  description: 'How to contribute content, code, or corrections to armhub.dev.',
};

export default function ContributingPage() {
  return (
    <>
      <section className="border-b">
        <div className="container py-12 sm:py-16">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Contributing</div>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-tight">
              Make this better.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              armhub is a public reference site built and maintained openly. Found a mistake, want to add a page,
              have a pattern that should be canonical here? Open an issue, send a PR.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-10">
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Quick start</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The site is a Next.js project. Content pages are MDX in <code className="rounded border bg-muted px-1 py-0.5 text-[0.85em] font-mono">content/&lt;section&gt;/</code>.
              Interactive components live in <code className="rounded border bg-muted px-1 py-0.5 text-[0.85em] font-mono">components/mdx/</code>. Styling is Tailwind.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-md border bg-muted/30 p-4 text-xs font-mono leading-relaxed text-foreground">
{`git clone https://github.com/sitharaj88/armhub
cd armhub
npm install
npm run dev          # opens http://localhost:3000`}
            </pre>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Adding a page</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Create a new MDX file under the appropriate section, e.g.{' '}
              <code className="rounded border bg-muted px-1 py-0.5 text-[0.85em] font-mono">content/peripherals/can-fd.mdx</code>:
            </p>
            <pre className="mt-4 overflow-x-auto rounded-md border bg-muted/30 p-4 text-xs font-mono leading-relaxed text-foreground">
{`---
title: CAN-FD
description: Flexible-Data-Rate CAN.
order: 10
updated: 2026-05-20
tags: [peripherals, can]
---

Your content here.`}
            </pre>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              It will be picked up automatically and routed at{' '}
              <code className="rounded border bg-muted px-1 py-0.5 text-[0.85em] font-mono">/docs/peripherals/can-fd</code>.
              Add it to <code className="rounded border bg-muted px-1 py-0.5 text-[0.85em] font-mono">lib/nav.ts</code> to show in the sidebar.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Editorial guidelines</h2>
            <ul className="mt-3 space-y-2 text-muted-foreground leading-relaxed">
              <li><strong className="text-foreground">Voice</strong> — confident, dry, technical. Aim for clarity, not enthusiasm.</li>
              <li><strong className="text-foreground">Audience</strong> — working firmware engineers. Don&apos;t explain what a register is. Do explain why this register, this way.</li>
              <li><strong className="text-foreground">Show, don&apos;t claim</strong> — every claim should have either a code sample or a register reference.</li>
              <li><strong className="text-foreground">No marketing</strong> — never recommend a vendor product without naming alternatives.</li>
              <li><strong className="text-foreground">Length</strong> — pages range 800–2500 words. Padding for length is not.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Components</h2>
            <ul className="mt-3 space-y-2 text-muted-foreground leading-relaxed">
              <li><code className="rounded border bg-muted px-1 py-0.5 text-[0.85em] font-mono">&lt;Callout type=&quot;...&quot; /&gt;</code> — note / tip / warn / danger / spec</li>
              <li><code className="rounded border bg-muted px-1 py-0.5 text-[0.85em] font-mono">&lt;RegisterMap /&gt;</code> — interactive bit-field viewer</li>
              <li><code className="rounded border bg-muted px-1 py-0.5 text-[0.85em] font-mono">&lt;MemoryMap /&gt;</code> — address-space diagram</li>
              <li><code className="rounded border bg-muted px-1 py-0.5 text-[0.85em] font-mono">&lt;CoreCompare /&gt;</code> — Cortex-M comparison</li>
              <li><code className="rounded border bg-muted px-1 py-0.5 text-[0.85em] font-mono">&lt;SystemBlock /&gt;</code> — block diagram for system designs</li>
              <li><code className="rounded border bg-muted px-1 py-0.5 text-[0.85em] font-mono">&lt;SpecSheet /&gt;</code> — at-a-glance spec table</li>
              <li><code className="rounded border bg-muted px-1 py-0.5 text-[0.85em] font-mono">&lt;Card href title description /&gt;</code> — link card</li>
              <li><code className="rounded border bg-muted px-1 py-0.5 text-[0.85em] font-mono">&lt;Terminal /&gt;</code> — terminal-styled code block</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Licensing</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Content is licensed CC BY 4.0; code under MIT. By contributing you agree to these licenses.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
