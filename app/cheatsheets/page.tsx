export const metadata = {
  title: 'Cheatsheets — armhub',
  description: 'Quick-reference compendium: GCC flags, GDB commands, register patterns, timing numbers for Cortex-M.',
};

const gccTable = [
  ['M0/M0+', 'cortex-m0plus', '—', 'soft'],
  ['M3', 'cortex-m3', '—', 'soft'],
  ['M4 (no FPU)', 'cortex-m4', '—', 'soft'],
  ['M4F', 'cortex-m4', 'fpv4-sp-d16', 'hard'],
  ['M7 (SP)', 'cortex-m7', 'fpv5-sp-d16', 'hard'],
  ['M7 (DP)', 'cortex-m7', 'fpv5-d16', 'hard'],
  ['M23', 'cortex-m23', '—', 'soft'],
  ['M33', 'cortex-m33', 'fpv5-sp-d16', 'hard'],
  ['M55', 'cortex-m55', 'auto', 'hard'],
  ['M85', 'cortex-m85', 'fpv5-d16', 'hard'],
];

const barriers = [
  ['Order memory ops', '__DMB()'],
  ['Wait for memory ops', '__DSB()'],
  ['Flush pipeline (sys reg)', '__DSB(); __ISB();'],
  ['Sleep until interrupt', '__WFI()'],
  ['Sleep until event', '__WFE()'],
  ['Disable all IRQs', '__disable_irq()'],
  ['Mask by priority', '__set_BASEPRI(p << (8 - bits))'],
];

const memoryMap = [
  ['Code (flash)', '0x0000_0000 – 0x1FFF_FFFF'],
  ['SRAM', '0x2000_0000 – 0x3FFF_FFFF'],
  ['Peripheral', '0x4000_0000 – 0x5FFF_FFFF'],
  ['External RAM', '0x6000_0000 – 0x9FFF_FFFF'],
  ['External device', '0xA000_0000 – 0xDFFF_FFFF'],
  ['Private Peripheral Bus', '0xE000_0000 – 0xE00F_FFFF'],
  ['SCB base', '0xE000_ED00'],
  ['NVIC base', '0xE000_E100'],
  ['SysTick base', '0xE000_E010'],
  ['MPU base', '0xE000_ED90'],
];

const exceptions = [
  ['1', 'Reset'],
  ['2', 'NMI'],
  ['3', 'HardFault'],
  ['4', 'MemManage'],
  ['5', 'BusFault'],
  ['6', 'UsageFault'],
  ['7', 'SecureFault (v8-M)'],
  ['11', 'SVCall'],
  ['12', 'DebugMonitor'],
  ['14', 'PendSV'],
  ['15', 'SysTick'],
  ['16+', 'External IRQs (vendor-specific)'],
];

const gdbCommands = `target extended-remote :3333    # connect
monitor reset halt              # halt at reset
load                            # flash + load symbols
break main                      # set breakpoint
continue / c                    # run
step / s                        # step (source)
stepi / si                      # step (instruction)
next / n                        # step over
finish                          # run to return
backtrace / bt                  # call stack
info registers                  # register dump
x/16wx 0xE000ED00               # examine 16 words hex at addr
set $pc = 0x08000200            # poke PC
monitor reset run               # reset + run`;

const stackFrame = `SP+0x1C  → xPSR        ← top
SP+0x18  → PC
SP+0x14  → LR
SP+0x10  → R12
SP+0x0C  → R3
SP+0x08  → R2
SP+0x04  → R1
SP+0x00  → R0          ← SP after entry

+ FPU frame (lazy):
SP+0x20..SP+0x60  → S0..S15 + FPSCR`;

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Table({ headers, rows }: { headers?: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto thin-scrollbar">
      <table className="w-full text-sm font-mono">
        {headers && (
          <thead>
            <tr className="text-left text-[0.7rem] uppercase tracking-wider text-muted-foreground">
              {headers.map((h) => (
                <th key={h} className="pb-2 pr-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-border/70">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j} className="py-2 pr-3 text-foreground">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CheatsheetsPage() {
  return (
    <>
      <section className="border-b">
        <div className="container py-12 sm:py-16">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Cheatsheets</div>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-tight">
              The bench-side reference.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Quick-lookup tables and command summaries for when you&apos;re at the workstation and need an answer in five
              seconds, not five clicks.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-8 sm:py-12 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <Card title="GCC flags by CPU">
          <Table headers={['Core', '-mcpu=', '-mfpu=', 'float-abi']} rows={gccTable} />
          <div className="mt-4 text-xs text-muted-foreground font-mono">
            always add: -mthumb -ffunction-sections -fdata-sections -Wl,--gc-sections
          </div>
        </Card>

        <Card title="CMSIS barriers — what to use when">
          <Table headers={['Need', 'Call']} rows={barriers} />
        </Card>

        <Card title="GDB / probe-rs essentials">
          <pre className="mt-2 overflow-x-auto thin-scrollbar text-xs font-mono text-foreground whitespace-pre rounded-md border bg-muted/30 p-4">
            {gdbCommands}
          </pre>
        </Card>

        <Card title="Cortex-M memory map">
          <Table headers={['Region', 'Address']} rows={memoryMap} />
        </Card>

        <Card title="Exception numbers">
          <Table rows={exceptions} />
        </Card>

        <Card title="Exception entry stack frame">
          <pre className="mt-2 overflow-x-auto thin-scrollbar text-xs font-mono text-foreground whitespace-pre rounded-md border bg-muted/30 p-4">
            {stackFrame}
          </pre>
        </Card>
      </section>
    </>
  );
}
