'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { mcus, type CoreKind, type Mcu, type Wireless } from '@/lib/mcu-db';
import { cn } from '@/lib/utils';

const coreOptions: { value: CoreKind; label: string }[] = [
  { value: 'M0',   label: 'M0' },
  { value: 'M0+',  label: 'M0+' },
  { value: 'M3',   label: 'M3' },
  { value: 'M4',   label: 'M4' },
  { value: 'M4F',  label: 'M4F' },
  { value: 'M7',   label: 'M7' },
  { value: 'M23',  label: 'M23' },
  { value: 'M33',  label: 'M33' },
  { value: 'M55',  label: 'M55' },
  { value: 'M85',  label: 'M85' },
];

const wirelessOptions: { value: Wireless | 'any'; label: string }[] = [
  { value: 'any',       label: 'Any / not required' },
  { value: 'ble',       label: 'BLE' },
  { value: 'wifi',      label: 'Wi-Fi' },
  { value: 'thread',    label: 'Thread / 802.15.4' },
  { value: 'matter',    label: 'Matter' },
  { value: 'lora',      label: 'LoRa' },
  { value: 'sub-ghz',   label: 'sub-GHz' },
  { value: 'none',      label: 'None (wired only)' },
];

const featureChips = [
  { id: 'FPU',        label: 'FPU' },
  { id: 'DSP',        label: 'DSP intrinsics' },
  { id: 'TrustZone',  label: 'TrustZone' },
  { id: 'Helium',     label: 'Helium / MVE' },
  { id: 'Cache',      label: 'L1 cache' },
  { id: 'TCM',        label: 'TCM' },
  { id: 'USB',        label: 'USB' },
  { id: 'Ethernet',   label: 'Ethernet' },
  { id: 'CAN',        label: 'CAN' },
  { id: 'CAN-FD',     label: 'CAN-FD' },
  { id: 'Crypto',     label: 'Crypto' },
] as const;

const powerLabels: Record<Mcu['power'], string> = {
  'ultra-low': 'Ultra-low',
  'low': 'Low',
  'general': 'General',
  'high-perf': 'High-performance',
};

export function FindMcu() {
  const [cores, setCores] = useState<Set<CoreKind>>(new Set());
  const [vendors, setVendors] = useState<Set<string>>(new Set());
  const [wireless, setWireless] = useState<Wireless | 'any'>('any');
  const [features, setFeatures] = useState<Set<string>>(new Set());
  const [minFlash, setMinFlash] = useState(0);
  const [minRam, setMinRam] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50);
  const [query, setQuery] = useState('');

  const vendorList = Array.from(new Set(mcus.map((m) => m.vendor))).sort();

  function toggle<T>(set: Set<T>, val: T, setter: (s: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    setter(next);
  }

  function reset() {
    setCores(new Set());
    setVendors(new Set());
    setWireless('any');
    setFeatures(new Set());
    setMinFlash(0);
    setMinRam(0);
    setMaxPrice(50);
    setQuery('');
  }

  const results = useMemo(() => {
    return mcus
      .filter((m) => (cores.size === 0 || cores.has(m.core)))
      .filter((m) => (vendors.size === 0 || vendors.has(m.vendor)))
      .filter((m) => {
        if (wireless === 'any') return true;
        if (wireless === 'none') return m.wireless.length === 1 && m.wireless[0] === 'none';
        return m.wireless.includes(wireless);
      })
      .filter((m) => Array.from(features).every((f) => (m.features as readonly string[]).includes(f)))
      .filter((m) => m.flashKB >= minFlash)
      .filter((m) => m.ramKB >= minRam)
      .filter((m) => m.priceUsd <= maxPrice)
      .filter((m) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return [m.id, m.family, m.vendor, m.blurb].some((s) => s.toLowerCase().includes(q));
      })
      .sort((a, b) => a.priceUsd - b.priceUsd);
  }, [cores, vendors, wireless, features, minFlash, minRam, maxPrice, query]);

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
      {/* FILTERS */}
      <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-lg border bg-card p-4 sm:p-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search part name, blurb…"
              className="w-full rounded-md border bg-background pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Core family */}
          <Section title="Core family">
            <div className="flex flex-wrap gap-1.5">
              {coreOptions.map((c) => (
                <Chip key={c.value} active={cores.has(c.value)} onClick={() => toggle(cores, c.value, setCores)}>
                  {c.label}
                </Chip>
              ))}
            </div>
          </Section>

          {/* Wireless */}
          <Section title="Wireless">
            <select
              value={wireless}
              onChange={(e) => setWireless(e.target.value as Wireless | 'any')}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {wirelessOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Section>

          {/* Features */}
          <Section title="Must have">
            <div className="flex flex-wrap gap-1.5">
              {featureChips.map((f) => (
                <Chip key={f.id} active={features.has(f.id)} onClick={() => toggle(features, f.id, setFeatures)}>
                  {f.label}
                </Chip>
              ))}
            </div>
          </Section>

          {/* Vendor */}
          <Section title="Vendor">
            <div className="flex flex-wrap gap-1.5">
              {vendorList.map((v) => (
                <Chip key={v} active={vendors.has(v)} onClick={() => toggle(vendors, v, setVendors)}>
                  {v}
                </Chip>
              ))}
            </div>
          </Section>

          {/* Sliders */}
          <Section title={`Min flash · ${minFlash === 0 ? 'any' : `${minFlash} KB`}`}>
            <input type="range" min={0} max={2048} step={32} value={minFlash} onChange={(e) => setMinFlash(Number(e.target.value))} className="w-full accent-primary" />
          </Section>
          <Section title={`Min RAM · ${minRam === 0 ? 'any' : `${minRam} KB`}`}>
            <input type="range" min={0} max={1024} step={16} value={minRam} onChange={(e) => setMinRam(Number(e.target.value))} className="w-full accent-primary" />
          </Section>
          <Section title={`Max unit price · ${maxPrice >= 50 ? 'any' : `$${maxPrice}`}`}>
            <input type="range" min={1} max={50} step={1} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-primary" />
          </Section>

          <button
            type="button"
            onClick={reset}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/40"
          >
            <X className="h-3 w-3" /> Reset filters
          </button>
        </div>
      </div>

      {/* RESULTS */}
      <div className="min-w-0">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-tight">
            <span className="tabular">{results.length}</span> match{results.length === 1 ? '' : 'es'}
          </h2>
          <span className="font-mono text-xs text-muted-foreground">sorted by price · low → high</span>
        </div>

        {results.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
            No parts match your filters. Try relaxing one.
          </div>
        ) : (
          <ul className="space-y-2.5">
            {results.map((m) => (
              <li key={m.id}>
                <McuCard mcu={m} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 first:mt-3">
      <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md border px-2 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-primary/45 bg-primary/15 text-primary'
          : 'border-border bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function McuCard({ mcu }: { mcu: Mcu }) {
  return (
    <div className="group rounded-lg border bg-card p-4 transition-colors hover:bg-muted/30 hover:border-foreground/20">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-base font-semibold tracking-tight">{mcu.id.toUpperCase()}</h3>
            <span className="font-mono text-xs text-muted-foreground">{mcu.family} · {mcu.vendor}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{mcu.blurb}</p>
        </div>
        <div className="text-right">
          <div className="tabular text-base font-semibold text-foreground">${mcu.priceUsd.toFixed(2)}</div>
          <div className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">qty 1k</div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 sm:grid-cols-4 text-xs">
        <Kv k="Core" v={`Cortex-${mcu.core}`} />
        <Kv k="Clock" v={`${mcu.mhz} MHz`} />
        <Kv k="Flash" v={mcu.flashKB === 0 ? 'external' : `${mcu.flashKB} KB`} />
        <Kv k="RAM" v={`${mcu.ramKB} KB`} />
        <Kv k="Pins" v={mcu.pinMin === mcu.pinMax ? `${mcu.pinMin}` : `${mcu.pinMin}–${mcu.pinMax}`} />
        <Kv k="Power" v={powerLabels[mcu.power]} />
        <Kv k="Wireless" v={mcu.wireless.includes('none') ? 'wired only' : mcu.wireless.join(' · ')} />
        <Kv k="Features" v={mcu.features.length === 0 ? '—' : mcu.features.join(' · ')} />
      </dl>

      {mcu.docUrl && (
        <div className="mt-3 border-t pt-3">
          <Link href={mcu.docUrl} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-glow">
            Read the deep dive <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}

function Kv({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col">
      <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="text-foreground truncate">{v}</dd>
    </div>
  );
}
