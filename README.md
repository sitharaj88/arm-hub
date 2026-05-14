<div align="center">

# armhub.dev

**The modern reference for ARM microcontroller and microprocessor development.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![MDX](https://img.shields.io/badge/MDX-content-1B1F24?logo=mdx)](https://mdxjs.com)
[![License: MIT + CC BY 4.0](https://img.shields.io/badge/license-MIT%20%2B%20CC%20BY%204.0-blue.svg)](#license)

[**Live site**](https://armhub.dev) · [Docs](https://armhub.dev/docs/architecture/isa-family) · [Tools](https://armhub.dev/tools) · [Cheatsheets](https://armhub.dev/cheatsheets) · [Glossary](https://armhub.dev/glossary)

</div>

---

armhub.dev is an open, opinionated reference for everything between the silicon and your firmware — **Cortex-M, Cortex-A, Cortex-R, peripherals, RTOSes, toolchains, vendor families**, and real-world **system designs** (Wi-Fi router, drone flight controller, EV charger, smartwatch, automotive ECU, motor drive, and more).

Written by a firmware engineer for firmware engineers. No marketing. No hand-waving. Just dense, accurate technical detail with working code, register layouts, timing diagrams, and the gotchas that bite you at 3 a.m.

---

## What's inside

**143 deep technical pages · 230,000+ words · 10 sections · 7 interactive tools · 15 visualization components**

### Reference sections

| Section | Pages | What's in it |
|---------|------:|--------------|
| **Architecture** | 15 | ARMv6-M / v7-M / v8-M / v8-R, AAPCS calling convention, exception model, memory model & barriers, exclusive monitors, TrustZone (both flavours), debug architecture, PMU, PAC/BTI/MTE |
| **Cortex-M** | 24 | Per-core deep dives for M0, M0+, M3, M4, M7, M23, M33, M55, M85; NVIC (overview / registers / priority / tail-chain); vector table; SCB; MPU; FPU; cache & TCM; DWT / ITM / ETM; CoreSight; low-power modes |
| **Cortex-A** | 12 | ISA evolution, boot flow & exception levels, MMU, TLB, caches & coherency, GIC, NEON/SVE, SMP, virtualization, big.LITTLE / DynamIQ, PMU |
| **Cortex-R** | 8 | ISA compare, lockstep & ASIL, MPU + TCM, vectored interrupts, ECC, safety standards (ISO 26262 / IEC 61508), R52 cluster mode |
| **Peripherals** | 19 | GPIO, UART, LIN/ISO7816, SPI, QSPI/OSPI, I²C, SMBus, CAN, CAN-FD, DMA (basic + advanced), timers + advanced control timers, ADC/DAC, USB device + host, Ethernet MAC, SDMMC |
| **Systems** | 16 | Wi-Fi router, smartwatch, drone flight controller (+ IMU & ESC deep-dives), EV charger (+ power stage), smart thermostat, automotive ECU + AUTOSAR, motor drive + FOC, IoT sensor node, medical wearable, industrial gateway |
| **Programming** | 12 | Embedded C patterns, volatile & MMIO, CMSIS, CMSIS-DSP, linker scripts, startup & vector table, C++ on Cortex-M, Rust on Cortex-M, inline assembly, bare-metal libc, bootloaders & DFU, OTA |
| **RTOS** | 10 | Landscape, scheduling theory, priority inversion, IPC primitives, tickless idle, FreeRTOS, Zephyr, ThreadX, RT-Thread, safety-certified options |
| **Tools** | 10 | GCC/LLVM toolchain, GDB, OpenOCD & probes, build systems, QEMU & Renode, semihosting, SWO/ITM, profiling, static analysis, formal methods |
| **Vendors** | 17 | STM32 (mainstream / low-power / wireless), NXP (Kinetis / i.MX RT / LPC), Nordic (nRF52 / nRF53 / nRF91), Raspberry Pi (RP2040 / RP2350), Renesas, TI (Tiva/MSP432 + Sitara), Microchip SAM, Silicon Labs, Infineon (XMC/PSoC + AURIX) |

### Interactive tools (`/tools`)

Browser-only, no server. Paste real values, get real answers.

| Tool | What it does |
|------|--------------|
| [HardFault decoder](https://armhub.dev/tools/fault-decoder) | Paste CFSR / HFSR / UFSR / BFSR hex — get the bits set, what each means, and likely root cause |
| [Stack-frame visualizer](https://armhub.dev/tools/stack-frame) | Decode the 8 (or 25 with FPU) words an exception pushes — see R0–R3, R12, LR, PC, xPSR labelled |
| [Find my MCU](https://armhub.dev/tools/find-mcu) | Filter by core, RAM, flash, wireless, vendor, certifications — surfaces realistic STM32 / nRF / RP / NXP / SiLabs picks |
| [GCC flag explainer](https://armhub.dev/tools/gcc-flags) | Paste an `arm-none-eabi-gcc` command — every flag decoded with what it does, when you need it, where to read more |
| [NVIC priority simulator](https://armhub.dev/tools/nvic-simulator) | Configure `PRIGROUP` + `__NVIC_PRIO_BITS`, add IRQs — see how the priority byte splits into preempt + sub, with a pairwise preemption matrix |
| [Interrupt-latency calculator](https://armhub.dev/tools/interrupt-latency) | Pick core, clock, stack / vector region, FPU mode — get cycle-by-cycle exception entry breakdown plus tail-chain and late-arrival numbers |
| [Linker script builder](https://armhub.dev/tools/linker-script) | Configure FLASH / SRAM / ITCM / DTCM regions, stack, heap, vector placement — generates a complete `linker.ld` with `.isr_vector`, `.data` LMA→VMA copy, and C++ ctor arrays |

---

## Visualization components

15 reusable MDX components for technical writing. All theme-aware (light + dark), responsive, keyboard-accessible.

| Component | Purpose |
|-----------|---------|
| `BlockDiagram` | System architecture diagrams with auto-routed orthogonal wires, side-aware exit/entry distribution, theme-tinted tones (core, memory, radio, periph, accel, security, storage, power, IO, external, cloud) |
| `RegisterMap` | Bit-field register layouts with access/reset/description per field |
| `MemoryMap` | Address-space visualization with region tooltips |
| `CoreCompare` | Side-by-side comparison tables for cores / options |
| `SpecSheet` | "At a glance" key-value summary box (used at the top of nearly every deep page) |
| `Stat` | Large numeric callouts |
| `Callout` | Inline asides — `note`, `tip`, `warn`, `danger`, `spec` |
| `Terminal` | Shell snippets with prompt styling |
| `LinkCard` | Cross-page reference cards |
| `CodeTabs` | Multi-language switchable code blocks |
| `SystemBlock` | Compact system block (legacy) |
| **`TimingDiagram`** | Clock + signal waveforms with sample markers (SPI, I²C, UART, QSPI, DShot, memory barriers, priority inversion, RMS scheduling) |
| **`PipelineDiagram`** | Per-cycle instruction flow with stage colours and stall bubbles (M0 / M3 / M7 pipelines, tail-chain vs standard exception entry) |
| **`StateDiagram`** | Finite-state machines with curved labelled edges (NVIC IRQ lifecycle, sleep modes, EL transitions, security states, exclusive-monitor states) |
| **`ProtocolFrame`** | Proportional bit-field frame diagrams (CAN/CAN-FD, USB token, Ethernet II, vector table, FPU stack frame, AAPCS save frame, AArch64 PTE) |

---

## Tech stack

- **Next.js 15** — App Router, `output: 'export'` for fully-static deployment
- **React 19** — `'use client'` islands for interactive components only
- **TypeScript 5.7** — strict mode
- **Tailwind CSS 3.4** — shadcn/ui design language, HSL CSS variables, dual theme
- **next-themes** — light/dark switching
- **next-mdx-remote** — RSC MDX compilation with `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`
- **rehype-pretty-code** + **Shiki** — syntax highlighting with `github-light` / `github-dark-dimmed`
- **Geist Sans / Geist Mono** — typography
- **Lucide** — iconography

Custom palette: `--primary` (violet 252°), `--accent` (cyan 198°), `--highlight` (amber 30°), with semantic tones (success, warning, info, destructive) and an animated 4-stop mesh-gradient for hero backdrops.

---

## Local development

```bash
git clone https://github.com/sitharaj88/armhub.git
cd armhub
npm install
npm run dev          # http://localhost:3000
```

### Useful scripts

```bash
npm run dev          # dev server with HMR
npm run dev:clean    # rm -rf .next && npm run dev (when HMR cache breaks)
npm run build        # static export to out/
npm run preview      # serve out/ locally
```

---

## Project layout

```
.
├── app/                       Next.js App Router
│   ├── page.tsx               homepage
│   ├── layout.tsx             root layout (theme provider, header, footer)
│   ├── globals.css            design tokens + prose styles
│   ├── docs/[...slug]/        dynamic doc pages
│   ├── tools/                 7 interactive tool pages
│   ├── learn/                 learning paths
│   ├── cheatsheets/           bench-side reference
│   ├── glossary/              ARM/embedded vocabulary
│   ├── contributing/          contribution guide
│   ├── og/[...slug]/          OpenGraph image route (satori)
│   ├── rss.xml/               RSS feed
│   ├── sitemap.xml/           sitemap
│   └── search-index.json/     client-side search index
├── components/
│   ├── site-header.tsx        sticky header with search + theme toggle
│   ├── site-footer.tsx
│   ├── doc-sidebar.tsx        section TOC
│   ├── doc-toc.tsx            in-page TOC (right rail)
│   ├── doc-pager.tsx          prev/next within a section
│   ├── mobile-section-nav.tsx
│   ├── search-dialog.tsx      cmd-K modal
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   ├── logo.tsx               hub-ring "o" logo
│   ├── ui/                    shadcn-style primitives
│   ├── mdx/                   15 visualization components
│   └── tools/                 7 interactive tool components
├── content/                   143 MDX pages, 10 sections
├── lib/
│   ├── content.ts             MDX file walker + frontmatter parser
│   ├── nav.ts                 site navigation tree
│   ├── mcu-db.ts              28-entry MCU database for the finder
│   ├── gcc-flags.ts           50+ GCC flag specs
│   ├── fault-bits.ts          CFSR/HFSR bit definitions
│   └── utils.ts               cn() helper, date formatter, reading time
├── public/                    favicon, robots.txt
├── _archive_astro/            previous Astro version (source only, for reference)
└── .github/workflows/         GitHub Pages deploy CI
```

---

## Build and deploy

```bash
npm run build        # outputs static site to out/
```

`next build` runs with `output: 'export'`. Every page is statically pre-rendered — no Node server required to serve the site. The output (`out/`) can be hosted on any static host (GitHub Pages, Vercel, Cloudflare Pages, Netlify, S3 + CloudFront, …).

armhub.dev itself ships on **GitHub Pages** via `.github/workflows/deploy.yml`:

1. Install deps with `npm ci`
2. Run `npm run build` (Next.js → static export)
3. Upload `out/` as a Pages artifact

For a custom domain:

1. Repo Settings → Pages → set custom domain
2. Add `CNAME` file in `public/` containing your domain
3. Point DNS at GitHub Pages

---

## Contributing

See [`/contributing`](https://armhub.dev/contributing) on the site. Short version:

1. Create a new MDX file under `content/<section>/<slug>.mdx`
2. Add frontmatter: `title`, `description` (130-180 char), `order`, `updated` (YYYY-MM-DD), optional `badge` (e.g. `"v8-M"`, `"Helium"`, `"security"`, `"new"`)
3. The page is automatically routed at `/docs/<section>/<slug>`
4. Add a link in `lib/nav.ts` to surface it in the sidebar
5. Use MDX components for visualization (`SpecSheet`, `Callout`, `RegisterMap`, `BlockDiagram`, `TimingDiagram`, etc.)
6. Open a PR with a clear description and a screenshot if it's visual

Style targets:

- 1500–3000 words per deep page
- Open with a `<SpecSheet>` at-a-glance block
- Include 2–3 tables and 1–2 callouts per page
- End with a `## Cross-references` section linking to related armhub pages
- Voice: senior firmware engineer briefing a team — no marketing tone, no emojis in content

---

## License

| Type | Scope | License |
|------|-------|---------|
| **Content** | everything under `content/` and prose inside `app/` | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| **Code** | components, infrastructure, build system | [MIT](./LICENSE) |

ARM, Cortex, TrustZone, NEON, Helium, big.LITTLE and DynamIQ are trademarks of Arm Limited. armhub.dev is an independent reference site, not affiliated with Arm Ltd. Vendor names (STM32, NXP, Nordic, Raspberry Pi, Renesas, TI, Microchip, Silicon Labs, Infineon, …) are trademarks of their respective owners.

---

## Author

**Sitharaj Seenivasan** — firmware and systems engineer.

[![Website](https://img.shields.io/badge/Website-sitharaj.in-0070f3?style=for-the-badge&logo=safari&logoColor=white)](https://sitharaj.in)
[![GitHub](https://img.shields.io/badge/GitHub-sitharaj88-181717?style=for-the-badge&logo=github)](https://github.com/sitharaj88)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sitharaj08-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sitharaj08)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-sitharaj88-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black)](https://www.buymeacoffee.com/sitharaj88)

If armhub.dev saved you time, the coffee button is genuinely the kindest way to say thanks — and it keeps the lights on for future content.

---

<div align="center">

Built with care for everyone who's debugged a HardFault at 3 a.m.

</div>
