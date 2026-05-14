// Cortex-M fault status register bit definitions.
// Sources: ARMv7-M ARM §B3.2.15, ARMv8-M ARM §D1.2.36.

export type FaultBit = {
  bit: number;
  reg: 'CFSR' | 'HFSR';
  /** Sub-register (MMFSR / BFSR / UFSR for CFSR; HFSR for HFSR). */
  sub: 'MMFSR' | 'BFSR' | 'UFSR' | 'HFSR';
  name: string;
  full: string;
  /** What this bit being set means. */
  meaning: string;
  /** Most common causes / how to triage. */
  cause: string;
  /** Severity grouping for the UI. */
  severity: 'usage' | 'bus' | 'mem' | 'system';
  /** Optional companion fault-address register (MMFAR/BFAR). */
  companion?: 'MMFAR' | 'BFAR';
};

export const cfsrBits: FaultBit[] = [
  // ── MMFSR (bits 0–7) — MemManage fault status
  { bit: 0,  reg: 'CFSR', sub: 'MMFSR', name: 'IACCVIOL',  full: 'Instruction access violation',
    meaning: 'The processor tried to fetch an instruction from a region the MPU forbids (XN, or no execute permission).',
    cause: 'Jumped to data memory; called a function that has been freed; bad function pointer; MPU misconfigured the .text region.',
    severity: 'mem' },
  { bit: 1,  reg: 'CFSR', sub: 'MMFSR', name: 'DACCVIOL',  full: 'Data access violation',
    meaning: 'A load or store hit an MPU region that denied the access (privilege, read-only violation, or NX-data being executed).',
    cause: 'Wrote to a read-only region; user-mode access to a privileged region; stack overflow into the next region; null-pointer write.',
    severity: 'mem', companion: 'MMFAR' },
  { bit: 3,  reg: 'CFSR', sub: 'MMFSR', name: 'MUNSTKERR', full: 'MemManage fault on unstacking',
    meaning: 'A fault occurred while popping the exception stack frame on return.',
    cause: 'Corrupted SP, MPU region disabled while the stack frame was sitting there, returning to a stack that was already freed.',
    severity: 'mem' },
  { bit: 4,  reg: 'CFSR', sub: 'MMFSR', name: 'MSTKERR',   full: 'MemManage fault on stacking',
    meaning: 'A fault occurred while pushing the exception stack frame on entry — usually a stack overflow.',
    cause: 'Stack overflowed into an MPU-forbidden region. Bump task/main stack size, enable PSPLIM, check for runaway recursion.',
    severity: 'mem' },
  { bit: 5,  reg: 'CFSR', sub: 'MMFSR', name: 'MLSPERR',   full: 'MemManage fault on FP lazy state preservation',
    meaning: 'A fault occurred when the FPU lazily pushed S0–S15 + FPSCR on exception entry.',
    cause: 'Stack overflow that only showed up once the FPU touched the lazy frame; insufficient stack budget for FPU-using ISRs.',
    severity: 'mem' },
  { bit: 7,  reg: 'CFSR', sub: 'MMFSR', name: 'MMARVALID', full: 'MMFAR valid',
    meaning: 'The fault address register MMFAR holds the address that caused the fault.',
    cause: 'Read MMFAR (0xE000_ED34) for the offending address.',
    severity: 'mem', companion: 'MMFAR' },

  // ── BFSR (bits 8–15) — BusFault status
  { bit: 8,  reg: 'CFSR', sub: 'BFSR',  name: 'IBUSERR',     full: 'Instruction bus error',
    meaning: 'A bus error occurred during an instruction fetch — the fetched word never made it to the core.',
    cause: 'PC pointing at non-existent memory (e.g. branch to 0xDEADBEEF); flash not powered or wait-states wrong.',
    severity: 'bus' },
  { bit: 9,  reg: 'CFSR', sub: 'BFSR',  name: 'PRECISERR',   full: 'Precise data bus error',
    meaning: 'A data access faulted, and BFAR holds the exact address. The faulting instruction is the stacked PC.',
    cause: 'Read/write to non-existent peripheral, unmapped flash window, unaligned access on a strict device region.',
    severity: 'bus', companion: 'BFAR' },
  { bit: 10, reg: 'CFSR', sub: 'BFSR',  name: 'IMPRECISERR', full: 'Imprecise data bus error',
    meaning: 'A delayed write buffer flush faulted asynchronously. The stacked PC is not the offending instruction.',
    cause: 'Hard to localise — usually a posted write to a peripheral that NACK\'d. Add a DSB after suspect peripheral writes to make it precise.',
    severity: 'bus' },
  { bit: 11, reg: 'CFSR', sub: 'BFSR',  name: 'UNSTKERR',    full: 'BusFault on unstacking',
    meaning: 'A bus error while popping the exception frame on return.',
    cause: 'Corrupted SP pointing at non-existent memory; returning to a stack already torn down.',
    severity: 'bus' },
  { bit: 12, reg: 'CFSR', sub: 'BFSR',  name: 'STKERR',      full: 'BusFault on stacking',
    meaning: 'A bus error while pushing the exception frame on entry.',
    cause: 'SP pointing outside valid SRAM; usually catastrophic stack pointer corruption.',
    severity: 'bus' },
  { bit: 13, reg: 'CFSR', sub: 'BFSR',  name: 'LSPERR',      full: 'BusFault on FP lazy state preservation',
    meaning: 'A bus error when the FPU lazily pushed S-registers.',
    cause: 'SP pointing outside valid memory at the moment an FPU instruction triggered lazy push.',
    severity: 'bus' },
  { bit: 15, reg: 'CFSR', sub: 'BFSR',  name: 'BFARVALID',   full: 'BFAR valid',
    meaning: 'BFAR holds the address that caused the bus fault.',
    cause: 'Read BFAR (0xE000_ED38) for the offending address.',
    severity: 'bus', companion: 'BFAR' },

  // ── UFSR (bits 16–31) — UsageFault status
  { bit: 16, reg: 'CFSR', sub: 'UFSR',  name: 'UNDEFINSTR', full: 'Undefined instruction',
    meaning: 'The CPU tried to execute an instruction it does not recognise.',
    cause: 'Jumped to data (PC odd or even should match Thumb mode); corrupted flash; using FPU instructions without enabling the FPU; wrong -mcpu.',
    severity: 'usage' },
  { bit: 17, reg: 'CFSR', sub: 'UFSR',  name: 'INVSTATE',   full: 'Invalid state',
    meaning: 'EPSR T-bit is wrong for the next instruction — usually a branch to a non-Thumb (even) address.',
    cause: 'Function pointer assembled without the Thumb bit set (LSB should be 1); jumped to ARM-mode code on a Thumb-only Cortex-M.',
    severity: 'usage' },
  { bit: 18, reg: 'CFSR', sub: 'UFSR',  name: 'INVPC',      full: 'Invalid PC load',
    meaning: 'An EXC_RETURN value loaded into PC did not match a valid pattern — exception return failed.',
    cause: 'Manually wrote LR before exception return; corrupted stack frame on return; mismatched FPU stacking flag.',
    severity: 'usage' },
  { bit: 19, reg: 'CFSR', sub: 'UFSR',  name: 'NOCP',       full: 'No coprocessor',
    meaning: 'Tried to execute a coprocessor instruction (typically FPU VFP) when that coprocessor is disabled.',
    cause: 'Did not enable the FPU in SCB->CPACR before running code that touches float; toolchain set -mfpu without runtime enable.',
    severity: 'usage' },
  { bit: 20, reg: 'CFSR', sub: 'UFSR',  name: 'STKOF',      full: 'Stack overflow (ARMv8-M)',
    meaning: 'SP crossed below MSPLIM or PSPLIM — built-in stack-overflow detection caught it.',
    cause: 'Bump stack size or fix the runaway. Without MSPLIM/PSPLIM, this same overflow would have silently corrupted .bss instead.',
    severity: 'usage' },
  { bit: 24, reg: 'CFSR', sub: 'UFSR',  name: 'UNALIGNED',  full: 'Unaligned access',
    meaning: 'An unaligned load/store fired with SCB->CCR.UNALIGN_TRP enabled, or any unaligned multi-word access (LDM/STM/LDRD).',
    cause: 'Cast packed-struct field to a wider pointer and dereferenced; unaligned multi-word transfer. Use memcpy or align the data.',
    severity: 'usage' },
  { bit: 25, reg: 'CFSR', sub: 'UFSR',  name: 'DIVBYZERO',  full: 'Divide by zero',
    meaning: 'A SDIV / UDIV with divisor 0 fired with SCB->CCR.DIV_0_TRP enabled.',
    cause: 'Check the divisor before division. Enabling DIV_0_TRP in CCR catches this; without it, division returns 0 silently.',
    severity: 'usage' },
];

export const hfsrBits: FaultBit[] = [
  { bit: 1,  reg: 'HFSR', sub: 'HFSR', name: 'VECTTBL',  full: 'Vector table read fault',
    meaning: 'A bus fault occurred while the processor was reading the vector table.',
    cause: 'VTOR points at invalid memory; flash not yet ready; vector table corrupted by a bad write.',
    severity: 'system' },
  { bit: 30, reg: 'HFSR', sub: 'HFSR', name: 'FORCED',   full: 'Escalated to HardFault',
    meaning: 'A configurable fault (Mem/Bus/Usage) fired while it was disabled or another fault was already being handled — escalated to HardFault.',
    cause: 'The "real" fault is in CFSR. Decode CFSR to see what actually went wrong.',
    severity: 'system' },
  { bit: 31, reg: 'HFSR', sub: 'HFSR', name: 'DEBUGEVT', full: 'Debug event',
    meaning: 'A debug event triggered the HardFault (vector catch, BKPT outside debug, etc.).',
    cause: 'Debugger lost connection; spurious BKPT in release build; halt request issued while running.',
    severity: 'system' },
];

export const allBits = [...cfsrBits, ...hfsrBits];

/** Parse a hex string like "0x00040000" or "40000" into a 32-bit number. Returns null on parse failure. */
export function parseHex(s: string): number | null {
  if (!s) return null;
  const t = s.trim().toLowerCase().replace(/^0x/, '').replace(/_/g, '');
  if (!/^[0-9a-f]+$/.test(t) || t.length > 8) return null;
  return parseInt(t, 16) >>> 0;
}

export function setBits(value: number, bits: FaultBit[]): FaultBit[] {
  return bits.filter((b) => (value & (1 << b.bit)) !== 0);
}

export function formatHex(v: number): string {
  return '0x' + v.toString(16).padStart(8, '0').toUpperCase();
}
