export type GlossaryEntry = {
  term: string;
  /** Optional alternative spellings / case variants (used by /glossary search). */
  aliases?: string[];
  /** Short definition. Markdown-style emphasis allowed in render. */
  def: string;
  /** Where to read more. */
  link?: string;
  /** Categorize for grouping in the glossary index. */
  group?: 'core' | 'memory' | 'peripheral' | 'safety' | 'security' | 'rtos' | 'tools' | 'protocol' | 'concept';
};

export const glossary: GlossaryEntry[] = [
  { term: 'AAPCS',     def: 'Procedure Call Standard for ARM — calling convention defining how parameters, returns, and registers behave across function boundaries.', group: 'concept', link: '/docs/programming/inline-asm' },
  { term: 'ADC',       def: 'Analog-to-Digital Converter. Samples a continuous voltage and produces a digital code (typically 10–16 bits on Cortex-M).', group: 'peripheral', link: '/docs/peripherals/adc' },
  { term: 'AHB',       def: 'Advanced High-performance Bus. ARM AMBA bus used to connect CPU, memory, and high-bandwidth peripherals on Cortex-M SoCs.', group: 'memory' },
  { term: 'APB',       def: 'Advanced Peripheral Bus. Slower-speed companion to AHB; used for register-mapped peripherals.', group: 'memory' },
  { term: 'ARMv6-M / v7-M / v8-M', aliases: ['ARMv6-M', 'ARMv7-M', 'ARMv8-M'], def: 'ARM M-profile ISA versions. v6-M = Cortex-M0/M0+, v7-M = Cortex-M3, v7E-M = M4/M7 (DSP), v8-M = M23/M33 (TrustZone), v8.1-M = M55/M85 (Helium).', group: 'core', link: '/docs/architecture/isa-family' },
  { term: 'ASIL',      def: 'Automotive Safety Integrity Level. ISO 26262 classification A–D for the rigor of safety mechanisms required.', group: 'safety', link: '/docs/cortex-r/lockstep' },
  { term: 'AUTOSAR',   def: 'AUTomotive Open System ARchitecture. Layered software architecture standard used in automotive ECUs (Classic Platform on Cortex-R/Cortex-M, Adaptive on Cortex-A).', group: 'rtos', link: '/docs/systems/automotive-ecu' },
  { term: 'AXI',       def: 'Advanced eXtensible Interface. ARM AMBA bus protocol for high-throughput SoC interconnect; used by Cortex-A and Cortex-M7.', group: 'memory' },
  { term: 'BASEPRI',   def: 'Cortex-M register that masks all exceptions at or below a given priority. Used by RTOSes for fast critical sections (ARMv7-M+).', group: 'core', link: '/docs/cortex-m/nvic' },
  { term: 'BLE',       def: 'Bluetooth Low Energy. Short-range radio standard for low-power devices (smartwatches, IoT sensors).', group: 'protocol', link: '/docs/systems/smartwatch' },
  { term: 'BSRR',      def: 'Bit Set/Reset Register. STM32 GPIO register for atomic single-cycle pin set or clear without read-modify-write.', group: 'peripheral', link: '/docs/peripherals/gpio' },
  { term: 'CAN / CAN-FD', aliases: ['CAN', 'CAN-FD'], def: 'Controller Area Network. Differential serial bus for vehicles and industrial machines. CAN-FD = Flexible Data-rate (up to 8 Mbps payload).', group: 'protocol', link: '/docs/peripherals/can' },
  { term: 'CFSR',      def: 'Configurable Fault Status Register at 0xE000_ED28. Tells you why a HardFault, MemManage, BusFault, or UsageFault triggered.', group: 'core', link: '/docs/architecture/exception-model' },
  { term: 'CMSIS',     def: 'Cortex Microcontroller Software Interface Standard. ARM-provided headers + intrinsics + driver model used by every vendor SDK.', group: 'tools', link: '/docs/programming/cmsis' },
  { term: 'CORDIC',    def: 'Coordinate Rotation Digital Computer. Hardware accelerator for sin/cos/atan implemented as a peripheral on STM32G4 — much faster than soft-float trig.', group: 'peripheral', link: '/docs/systems/motor-drive' },
  { term: 'DMA',       def: 'Direct Memory Access. Engine that moves data between memory and peripherals without CPU involvement.', group: 'peripheral', link: '/docs/peripherals/dma' },
  { term: 'DMIPS',     def: 'Dhrystone MIPS — synthetic benchmark used to compare CPU performance per MHz across cores.', group: 'core' },
  { term: 'DSHOT',     def: 'Digital protocol for talking to brushless ESCs. PWM-encoded 16-bit packets at 150/300/600/1200 kHz; replaces analogue PWM in drones.', group: 'protocol', link: '/docs/systems/drone-flight-controller' },
  { term: 'EKF',       def: 'Extended Kalman Filter. Sensor fusion algorithm combining gyro + accel + GPS + baro into a position+attitude estimate.', group: 'concept', link: '/docs/systems/drone-flight-controller' },
  { term: 'EXC_RETURN', def: 'Magic 0xFFFFFFFx value loaded into LR on Cortex-M exception entry. Encodes which stack to unstack from and what mode to return to.', group: 'core', link: '/docs/architecture/exception-model' },
  { term: 'EXTI',      def: 'STM32 External Interrupt controller. Routes GPIO edges (rising/falling) to the NVIC.', group: 'peripheral', link: '/docs/peripherals/gpio' },
  { term: 'FOC',       def: 'Field-Oriented Control. Motor-control technique that controls the rotor field directly via Park/Clarke transforms; produces smoother torque than block commutation.', group: 'concept', link: '/docs/systems/motor-drive' },
  { term: 'FPU',       def: 'Floating-Point Unit. Hardware single-precision (Cortex-M4F) or single+double precision (M7/M33/M55/M85) IEEE-754 arithmetic.', group: 'core' },
  { term: 'FreeRTOS',  def: 'The most-used embedded RTOS. MIT-licensed, ~6 KB minimum, ports to essentially every Cortex-M.', group: 'rtos', link: '/docs/rtos/freertos' },
  { term: 'GIC',       def: 'Generic Interrupt Controller. Cortex-A interrupt controller (the equivalent of NVIC on Cortex-M).', group: 'core', link: '/docs/cortex-a/overview' },
  { term: 'Helium / MVE', aliases: ['Helium', 'MVE'], def: 'M-profile Vector Extension. SIMD ISA on Cortex-M55/M85 that reuses the FPU register file as 8×128-bit vectors. Tail-predicated.', group: 'core', link: '/docs/cortex-m/m55-m85' },
  { term: 'HSM',       def: 'Hardware Security Module. On-die crypto coprocessor used in automotive ECUs (EVITA spec) for key storage, AES, signed firmware updates.', group: 'security' },
  { term: 'I²C',       aliases: ['I2C', 'I²C'], def: 'Two-wire bus (SCL + SDA) for slow peripherals. Open-drain with pull-ups; supports clock-stretching and multi-master.', group: 'protocol', link: '/docs/peripherals/i2c' },
  { term: 'ITCM / DTCM', aliases: ['ITCM', 'DTCM'], def: 'Tightly Coupled Memory. Single-cycle SRAM directly attached to Cortex-M7/R4+ cores, bypassing the cache. ITCM for code, DTCM for data.', group: 'memory', link: '/docs/cortex-m/m7' },
  { term: 'IPSR',      def: 'Interrupt Program Status Register. Holds the active exception number when in handler mode (0 in thread mode).', group: 'core' },
  { term: 'LDREX / STREX', aliases: ['LDREX', 'STREX'], def: 'Cortex-M3+ exclusive load/store pair. Foundation of all lock-free atomic operations.', group: 'core', link: '/docs/architecture/memory-model' },
  { term: 'Lockstep',  def: 'Two CPU cores executing identical instructions in parallel; a comparator faults if outputs ever differ. Detects random hardware faults; used on Cortex-R for ASIL-D.', group: 'safety', link: '/docs/cortex-r/lockstep' },
  { term: 'Matter',    def: 'IP-based smart-home standard (CSA). Runs over Wi-Fi, Thread, or Ethernet. Commissioning via BLE.', group: 'protocol', link: '/docs/systems/smart-thermostat' },
  { term: 'MMU',       def: 'Memory Management Unit. Translates virtual to physical addresses; required for Linux and other rich OSes. Cortex-A only.', group: 'memory', link: '/docs/cortex-a/mmu' },
  { term: 'MPU',       def: 'Memory Protection Unit. Region-based access control (R/W/X per region). Present on Cortex-M3+ and Cortex-R; simpler than MMU.', group: 'memory' },
  { term: 'MSP / PSP', aliases: ['MSP', 'PSP'], def: 'Main / Process Stack Pointer. Cortex-M has two banked SPs — MSP for handlers and pre-RTOS, PSP for user tasks under an RTOS.', group: 'core' },
  { term: 'NVIC',      def: 'Nested Vectored Interrupt Controller. Tightly-coupled to every Cortex-M core. Up to 240 IRQs, 256 priority levels (vendor-configurable).', group: 'core', link: '/docs/cortex-m/nvic' },
  { term: 'OCPP',      def: 'Open Charge Point Protocol. JSON-over-WebSocket-TLS API every commercial EV charger speaks to its cloud management system.', group: 'protocol', link: '/docs/systems/ev-charger' },
  { term: 'PACBTI',    def: 'Pointer Authentication + Branch Target Identification. ARMv8.1-M security extensions — defeats ROP/JOP attacks.', group: 'security', link: '/docs/cortex-m/m55-m85' },
  { term: 'PendSV',    def: 'Pending Supervisor exception (#14). The trick RTOSes use to perform context switches *after* higher-priority ISRs return.', group: 'core' },
  { term: 'PrimaSK',   aliases: ['PRIMASK'], def: 'Cortex-M mask register. Setting it to 1 disables all maskable exceptions (NMI + HardFault still fire).', group: 'core' },
  { term: 'PSCI',      def: 'Power State Coordination Interface. The standardized way Linux talks to TF-A on ARMv8-A to power CPUs on/off and reboot.', group: 'concept', link: '/docs/cortex-a/boot-and-exception-levels' },
  { term: 'PWM',       def: 'Pulse-Width Modulation. Time-encoded analogue output via a digital pin. Used for motor drive, LED dimming, audio.', group: 'peripheral', link: '/docs/peripherals/timers' },
  { term: 'RCD',       def: 'Residual Current Device. Trips power if the live and neutral currents don\'t balance — required ground-fault protection in EV chargers.', group: 'safety', link: '/docs/systems/ev-charger' },
  { term: 'RTOS',      def: 'Real-Time Operating System. Tiny preemptive scheduler with deterministic timing.', group: 'rtos', link: '/docs/rtos/landscape' },
  { term: 'SAU / IDAU', aliases: ['SAU', 'IDAU'], def: 'Security Attribution Unit + Implementation-Defined Attribution Unit. ARMv8-M hardware that decides whether each memory access is Secure or Non-secure.', group: 'security', link: '/docs/architecture/trustzone' },
  { term: 'SBI',       def: 'Supervisor Binary Interface — boot+runtime API for RISC-V. ARM\'s equivalent is PSCI.', group: 'concept' },
  { term: 'SCB',       def: 'System Control Block. Cortex-M peripheral at 0xE000_ED00 containing CPUID, CFSR, VTOR, AIRCR, and many fault/system registers.', group: 'core' },
  { term: 'SHC / SVC', aliases: ['SVC', 'SVCall'], def: 'Supervisor Call. SVC #imm triggers SVCall exception (#11) — RTOSes use it to enter privileged mode.', group: 'core' },
  { term: 'Shiki',     def: 'Syntax highlighter used by this site. Generates pre-coloured spans at build time; no client-side highlighting cost.', group: 'tools' },
  { term: 'SPI',       def: 'Serial Peripheral Interface. 4-wire synchronous serial bus. Up to half PCLK in master mode (~40 MHz on STM32F4).', group: 'protocol', link: '/docs/peripherals/spi' },
  { term: 'SRAM',      def: 'Static RAM. Volatile fast memory used for stacks, heap, and DMA buffers in microcontrollers. Typically 16 KB – 1 MB.', group: 'memory' },
  { term: 'STO',       def: 'Safe Torque Off. IEC 61800-5-2 SIL-3 mandatory hardware input that disables motor-drive gate drivers regardless of firmware state.', group: 'safety', link: '/docs/systems/motor-drive' },
  { term: 'SysTick',   def: 'Universal 24-bit Cortex-M downcounter at 0xE000_E010. Standard RTOS tick source.', group: 'core', link: '/docs/cortex-m/systick' },
  { term: 'Thread',    def: '802.15.4 mesh networking. Low-power IP-over-radio, foundation of Matter for non-Wi-Fi devices.', group: 'protocol' },
  { term: 'TrustZone', def: 'ARM\'s hardware partitioning. Cortex-M: per-access SAU+IDAU. Cortex-A: NS bit + EL3 secure monitor.', group: 'security', link: '/docs/architecture/trustzone' },
  { term: 'TLB',       def: 'Translation Lookaside Buffer. Cache of MMU virtual-to-physical translations on Cortex-A.', group: 'memory', link: '/docs/cortex-a/mmu' },
  { term: 'UART',      def: 'Universal Asynchronous Receiver/Transmitter. Two-wire (TX, RX) serial bus; the first peripheral you wire on a new board.', group: 'protocol', link: '/docs/peripherals/uart' },
  { term: 'VTOR',      def: 'Vector Table Offset Register at 0xE000_ED08. Lets firmware relocate the vector table to RAM or a different flash region.', group: 'core' },
  { term: 'Zephyr',    def: 'Linux Foundation embedded OS. Full stack with drivers, networking, BLE — bigger than FreeRTOS but provides much more out of the box.', group: 'rtos', link: '/docs/rtos/zephyr' },
];
