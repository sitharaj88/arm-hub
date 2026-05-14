// Catalogue of arm-none-eabi-gcc flags commonly seen in Cortex-M build commands.

export type FlagCategory = 'cpu' | 'fpu' | 'isa' | 'optimisation' | 'linker' | 'cpp' | 'warning' | 'debug' | 'standard' | 'misc';

export type FlagSpec = {
  /** Match patterns. Order matters — first match wins. */
  matchers: (RegExp | string)[];
  category: FlagCategory;
  label: string;
  effect: string;
  /** Where to read more. */
  docHref?: string;
};

export const flagSpecs: FlagSpec[] = [
  // ── CPU
  { matchers: [/^-mcpu=cortex-m0plus$/i], category: 'cpu', label: 'Target Cortex-M0+', effect: 'Generate ARMv6-M Thumb code for Cortex-M0+. No DSP, no FPU. 2-stage pipeline.', docHref: '/docs/cortex-m/m0-m0plus' },
  { matchers: [/^-mcpu=cortex-m0$/i],     category: 'cpu', label: 'Target Cortex-M0',  effect: 'Generate ARMv6-M Thumb code for Cortex-M0. No DSP, no FPU.', docHref: '/docs/cortex-m/m0-m0plus' },
  { matchers: [/^-mcpu=cortex-m3$/i],     category: 'cpu', label: 'Target Cortex-M3',  effect: 'Generate ARMv7-M Thumb code for Cortex-M3 — full Thumb-2, HW divide.', docHref: '/docs/cortex-m/m3' },
  { matchers: [/^-mcpu=cortex-m4$/i],     category: 'cpu', label: 'Target Cortex-M4',  effect: 'Generate ARMv7E-M Thumb code for Cortex-M4 — DSP intrinsics enabled. Floats via -mfpu.', docHref: '/docs/cortex-m/m4' },
  { matchers: [/^-mcpu=cortex-m7$/i],     category: 'cpu', label: 'Target Cortex-M7',  effect: 'Generate ARMv7E-M Thumb code for Cortex-M7 — dual-issue pipeline, branch prediction.', docHref: '/docs/cortex-m/m7' },
  { matchers: [/^-mcpu=cortex-m23$/i],    category: 'cpu', label: 'Target Cortex-M23', effect: 'Generate ARMv8-M Baseline Thumb code — TrustZone, MPU optional.', docHref: '/docs/cortex-m/m33-m23' },
  { matchers: [/^-mcpu=cortex-m33$/i],    category: 'cpu', label: 'Target Cortex-M33', effect: 'Generate ARMv8-M Mainline Thumb code — TrustZone, optional FPU+DSP.', docHref: '/docs/cortex-m/m33-m23' },
  { matchers: [/^-mcpu=cortex-m55$/i],    category: 'cpu', label: 'Target Cortex-M55', effect: 'Generate ARMv8.1-M code — Helium / MVE, low-overhead loops.', docHref: '/docs/cortex-m/m55-m85' },
  { matchers: [/^-mcpu=cortex-m85$/i],    category: 'cpu', label: 'Target Cortex-M85', effect: 'Generate ARMv8.1-M code — Helium, PACBTI, dual-issue.', docHref: '/docs/cortex-m/m55-m85' },
  { matchers: [/^-mcpu=cortex-/i],        category: 'cpu', label: 'Target a Cortex-* core', effect: 'Generic Cortex target. Pairs with -mthumb and possibly -mfpu / -mfloat-abi.' },
  { matchers: [/^-march=armv\d/i],        category: 'cpu', label: 'Target an ARM ISA version', effect: 'Select the base ISA explicitly (rare; -mcpu is preferred and implies -march).' },

  // ── ISA
  { matchers: ['-mthumb'],                category: 'isa', label: 'Thumb mode',          effect: 'Generate Thumb-2 instructions only — required for every Cortex-M core.' },
  { matchers: ['-marm'],                  category: 'isa', label: 'ARM mode (32-bit)',   effect: 'Generate 32-bit ARM instructions. Invalid on Cortex-M — only useful on Cortex-A/R.' },

  // ── FPU
  { matchers: [/^-mfpu=fpv4-sp-d16$/i],   category: 'fpu', label: 'FPU: VFPv4-SP-D16',  effect: 'Cortex-M4F single-precision FPU, 16 D-regs / 32 S-regs.', docHref: '/docs/cortex-m/m4' },
  { matchers: [/^-mfpu=fpv5-sp-d16$/i],   category: 'fpu', label: 'FPU: VFPv5-SP-D16',  effect: 'Cortex-M7/M33 single-precision FPU.' },
  { matchers: [/^-mfpu=fpv5-d16$/i],      category: 'fpu', label: 'FPU: VFPv5-D16',     effect: 'Cortex-M7 double-precision FPU.', docHref: '/docs/cortex-m/m7' },
  { matchers: [/^-mfpu=auto$/i],          category: 'fpu', label: 'FPU: auto',          effect: 'Let the toolchain pick the FPU type for the configured -mcpu.' },
  { matchers: [/^-mfloat-abi=hard$/i],    category: 'fpu', label: 'Hard-float ABI',     effect: 'Pass float arguments in FPU registers (s0–s15). Required to actually use the FPU.' },
  { matchers: [/^-mfloat-abi=softfp$/i],  category: 'fpu', label: 'softfp ABI',         effect: 'Use FPU registers internally but pass floats via integer regs — links cleanly with soft-float libraries.' },
  { matchers: [/^-mfloat-abi=soft$/i],    category: 'fpu', label: 'Soft-float',         effect: 'Emulate floats via library calls — no FPU used. Default if no FPU is specified.' },

  // ── Security extensions
  { matchers: ['-mcmse'],                 category: 'isa', label: 'Cortex-M Security Extension',  effect: 'Enable TrustZone-M support — emits SG/BXNS/BLXNS instructions and recognises cmse_* attributes.', docHref: '/docs/architecture/trustzone' },
  { matchers: [/^-mbranch-protection=/i], category: 'isa', label: 'Pointer auth / BTI',           effect: 'Emit PACBTI instructions on ARMv8.1-M to defend against ROP/JOP attacks.' },

  // ── Optimisation
  { matchers: ['-O0'],                    category: 'optimisation', label: 'No optimisation',           effect: 'Best for debugging — straight-line code generation, no inlining.' },
  { matchers: ['-O1'],                    category: 'optimisation', label: '-O1 light optimisation',     effect: 'Local optimisations only; modest size and speed wins, mostly debuggable.' },
  { matchers: ['-O2'],                    category: 'optimisation', label: '-O2 (recommended)',         effect: 'Standard optimisation — most production code uses this.' },
  { matchers: ['-O3'],                    category: 'optimisation', label: '-O3 aggressive',            effect: 'Heavy inlining + vectorisation. May bloat code; benchmark before adopting.' },
  { matchers: ['-Os'],                    category: 'optimisation', label: '-Os optimise for size',     effect: 'Like -O2 but biased toward smaller binaries. Common for flash-constrained MCUs.' },
  { matchers: ['-Oz'],                    category: 'optimisation', label: '-Oz aggressive size',       effect: 'LLVM/clang-only: more aggressive size optimisation than -Os.' },
  { matchers: ['-Og'],                    category: 'optimisation', label: '-Og debug-friendly',         effect: '-O1 with debugging fidelity preserved — variables remain inspectable.' },
  { matchers: ['-flto'],                  category: 'optimisation', label: 'Link-time optimisation',     effect: 'Defer codegen to link time so the compiler can inline across translation units. 5–15% size win typical.' },
  { matchers: ['-ffunction-sections'],    category: 'optimisation', label: 'Per-function sections',     effect: 'Place each function in its own ELF section so the linker can drop unused ones with --gc-sections.' },
  { matchers: ['-fdata-sections'],        category: 'optimisation', label: 'Per-data sections',         effect: 'Place each variable in its own ELF section so the linker can drop unused globals.' },
  { matchers: ['-fno-common'],            category: 'optimisation', label: 'No COMMON globals',         effect: 'Place tentative definitions in .bss directly rather than the legacy COMMON section.' },

  // ── Linker
  { matchers: [/^-Wl,--gc-sections$/],    category: 'linker', label: 'Garbage-collect sections',  effect: 'Linker drops sections not reachable from entry symbols. Needs -ffunction-sections / -fdata-sections to be useful.' },
  { matchers: [/^-Wl,-Map=/],             category: 'linker', label: 'Emit a .map file',          effect: 'Linker writes a memory map showing symbol addresses and section sizes — invaluable when flash is tight.' },
  { matchers: [/^-Wl,--build-id/],        category: 'linker', label: 'Embed build ID',            effect: 'Stamp a unique ID into the binary so crash dumps can identify which build crashed.' },
  { matchers: [/^-T/],                    category: 'linker', label: 'Use a custom linker script', effect: 'Specifies the .ld file describing memory regions and section layout.', docHref: '/docs/programming/linker-scripts' },
  { matchers: ['-nostartfiles'],          category: 'linker', label: "Skip C runtime's _start", effect: 'Do not link the libc startup file. You provide your own Reset_Handler.', docHref: '/docs/programming/startup' },
  { matchers: ['-nostdlib'],              category: 'linker', label: 'Bare-metal linking',         effect: 'Do not link the standard library or startup files. Truly freestanding builds.' },
  { matchers: [/^--specs=nano\.specs/],   category: 'linker', label: 'Use newlib-nano',           effect: 'Link against the size-optimised newlib — smaller printf, ~30 KB saved.' },
  { matchers: [/^--specs=nosys\.specs/],  category: 'linker', label: 'Stub out OS syscalls',       effect: 'Provide empty stubs for newlib syscalls (_write, _sbrk, etc.) so the linker resolves.' },

  // ── C++
  { matchers: ['-fno-exceptions'],        category: 'cpp', label: 'Disable C++ exceptions',        effect: 'No try/catch/throw. Eliminates the unwinding tables — typically tens of KB of savings.', docHref: '/docs/programming/cpp' },
  { matchers: ['-fno-rtti'],              category: 'cpp', label: 'Disable RTTI',                 effect: 'No typeid / dynamic_cast. Smaller binaries, mandatory in most embedded C++.' },
  { matchers: ['-fno-threadsafe-statics'],category: 'cpp', label: 'Non-thread-safe statics',       effect: 'C++11 mandates safe init of function-local statics with locks; this strips them — fine in single-task code.' },
  { matchers: ['-fno-use-cxa-atexit'],    category: 'cpp', label: 'No __cxa_atexit registration',  effect: 'Skip registering static destructors for exit() — your firmware never exits anyway.' },
  { matchers: [/^-std=c\+\+/i],           category: 'cpp', label: 'C++ standard',                  effect: 'Selects the C++ language standard (-std=c++17 / c++20 / c++23).' },
  { matchers: [/^-std=gnu\+\+/i],         category: 'cpp', label: 'C++ standard + GNU exts',       effect: 'C++ with GNU extensions enabled.' },

  // ── C standard
  { matchers: [/^-std=c\d/i, /^-std=c11$/i, /^-std=c17$/i, /^-std=c2x$/i, /^-std=c23$/i],
                                          category: 'standard', label: 'C standard', effect: 'Selects the C language standard.' },
  { matchers: [/^-std=gnu\d/i, /^-std=gnu11$/i, /^-std=gnu17$/i],
                                          category: 'standard', label: 'C with GNU extensions', effect: 'C standard with GCC-specific extensions enabled.' },

  // ── Warnings
  { matchers: ['-Wall'],                  category: 'warning', label: 'Enable common warnings',     effect: 'Turns on a broad set of warnings. Always include this.' },
  { matchers: ['-Wextra'],                category: 'warning', label: 'Extra warnings',             effect: 'Adds further useful warnings on top of -Wall.' },
  { matchers: ['-Wpedantic'],             category: 'warning', label: 'Pedantic ISO compliance',    effect: 'Warn about anything that isn\'t strictly ISO C/C++.' },
  { matchers: ['-Wshadow'],               category: 'warning', label: 'Warn on shadowing',          effect: 'Catches inner identifiers that shadow outer ones — common bug source.' },
  { matchers: ['-Wundef'],                category: 'warning', label: 'Warn on undefined macros',   effect: 'Catches typos in #if defined(FOO) where FOO is misspelled.' },
  { matchers: ['-Wconversion'],           category: 'warning', label: 'Warn on implicit conversions', effect: 'Flags lossy implicit conversions — noisy but catches subtle bugs.' },
  { matchers: ['-Werror'],                category: 'warning', label: 'Warnings are errors',        effect: 'Treat warnings as compile errors. Strongly recommended in CI.' },

  // ── Debug
  { matchers: ['-g'],                     category: 'debug', label: 'Emit debug info',             effect: 'DWARF debug info — required for GDB symbol resolution.' },
  { matchers: [/^-g\d/i, /^-ggdb/i],      category: 'debug', label: 'Debug info, higher level',     effect: '-g1 (minimal) / -g2 (default) / -g3 (with macros).' },

  // ── Misc
  { matchers: ['-Wno-...'],               category: 'misc',  label: 'Suppress specific warning',    effect: 'Selectively silence a warning kind.' },
  { matchers: ['-DNDEBUG'],               category: 'misc',  label: 'Disable assertions',           effect: 'standard assert() expands to nothing. Common in release builds.' },
  { matchers: [/^-D/],                    category: 'misc',  label: 'Define a preprocessor macro', effect: 'e.g. -DSTM32F407xx sets the macro for the device header to select.' },
  { matchers: [/^-I/],                    category: 'misc',  label: 'Add an include directory',    effect: 'Adds a path to the header search.' },
  { matchers: [/^-L/],                    category: 'misc',  label: 'Add a library search path',   effect: 'Adds a path to the linker library search.' },
  { matchers: [/^-l/],                    category: 'misc',  label: 'Link against a library',     effect: 'e.g. -lm links libm (math), -lc links libc.' },
  { matchers: ['-c'],                     category: 'misc',  label: 'Compile only, no link',        effect: 'Emit object file, do not link.' },
  { matchers: ['-S'],                     category: 'misc',  label: 'Generate assembly',           effect: 'Emit .s assembly source instead of object code.' },
  { matchers: ['-E'],                     category: 'misc',  label: 'Preprocess only',             effect: 'Run cpp only — useful for inspecting macro expansion.' },
  { matchers: [/^-o\b/, /^-o$/i],         category: 'misc',  label: 'Output filename',             effect: 'The next argument is the output file name.' },
];

export const categoryLabels: Record<FlagCategory, string> = {
  cpu: 'CPU target',
  fpu: 'FPU',
  isa: 'ISA mode',
  optimisation: 'Optimisation',
  linker: 'Linker',
  cpp: 'C++ ABI',
  warning: 'Warnings',
  debug: 'Debug',
  standard: 'Language standard',
  misc: 'Misc',
};

export const categoryColours: Record<FlagCategory, string> = {
  cpu:          'border-primary/30 bg-primary/8 text-primary',
  fpu:          'border-accent/30 bg-accent/8 text-accent',
  isa:          'border-primary/30 bg-primary/8 text-primary',
  optimisation: 'border-success/30 bg-success/8 text-success',
  linker:       'border-highlight/30 bg-highlight/8 text-highlight',
  cpp:          'border-info/30 bg-info/8 text-info',
  warning:      'border-warning/30 bg-warning/8 text-warning',
  debug:        'border-muted-foreground/30 bg-muted/40 text-foreground',
  standard:     'border-info/30 bg-info/8 text-info',
  misc:         'border-border bg-muted/40 text-foreground',
};

export type ParsedFlag =
  | { kind: 'matched'; raw: string; spec: FlagSpec }
  | { kind: 'unknown'; raw: string };

/**
 * Tokenize a GCC command line and return a flag-by-flag decoding.
 * Handles -X=value, -X value, -Wl,..., -DFOO=bar, etc.
 */
export function parseGccCommand(cmd: string): ParsedFlag[] {
  // Drop any leading executable name(s)
  const tokens = cmd
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  // Skip program name (first token if not a flag) and any input filenames at the end
  let start = 0;
  if (tokens[0] && !tokens[0].startsWith('-')) start = 1;

  const out: ParsedFlag[] = [];
  for (let i = start; i < tokens.length; i++) {
    const raw = tokens[i];
    if (!raw.startsWith('-')) continue; // skip input/output filenames in the middle

    // -o filename → consume the next token
    let combined = raw;
    if (raw === '-o' && tokens[i + 1]) {
      combined = `-o ${tokens[i + 1]}`;
      i++;
    }

    const spec = flagSpecs.find((s) =>
      s.matchers.some((m) => (typeof m === 'string' ? m === raw : m.test(raw))),
    );

    if (spec) {
      out.push({ kind: 'matched', raw: combined, spec });
    } else {
      out.push({ kind: 'unknown', raw: combined });
    }
  }
  return out;
}
