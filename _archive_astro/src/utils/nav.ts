export type NavLink = { title: string; href: string; badge?: string };
export type NavSection = { title: string; key: string; intro: string; links: NavLink[] };

export const sections: NavSection[] = [
  {
    title: 'Architecture',
    key: 'architecture',
    intro: 'ARMv6-M through ARMv9-A. Pipelines, modes, exception models, memory ordering.',
    links: [
      { title: 'ARM ISA family', href: '/docs/architecture/isa-family/' },
      { title: 'ARMv7-M & ARMv8-M', href: '/docs/architecture/armv7m-armv8m/' },
      { title: 'Exception model', href: '/docs/architecture/exception-model/' },
      { title: 'Memory model & barriers', href: '/docs/architecture/memory-model/' },
      { title: 'TrustZone', href: '/docs/architecture/trustzone/', badge: 'security' },
    ],
  },
  {
    title: 'Cortex-M',
    key: 'cortex-m',
    intro: 'Microcontroller-class cores — M0 through M85. Real-time, deterministic, deeply embedded.',
    links: [
      { title: 'Core lineup', href: '/docs/cortex-m/lineup/' },
      { title: 'Cortex-M0 / M0+', href: '/docs/cortex-m/m0-m0plus/' },
      { title: 'Cortex-M3', href: '/docs/cortex-m/m3/' },
      { title: 'Cortex-M4', href: '/docs/cortex-m/m4/' },
      { title: 'Cortex-M7', href: '/docs/cortex-m/m7/' },
      { title: 'Cortex-M33 / M23', href: '/docs/cortex-m/m33-m23/', badge: 'v8-M' },
      { title: 'Cortex-M55 / M85', href: '/docs/cortex-m/m55-m85/', badge: 'Helium' },
      { title: 'NVIC deep dive', href: '/docs/cortex-m/nvic/' },
      { title: 'SysTick & timing', href: '/docs/cortex-m/systick/' },
    ],
  },
  {
    title: 'Cortex-A',
    key: 'cortex-a',
    intro: 'Applications-class cores running rich operating systems. MMU, caches, SMP.',
    links: [
      { title: 'Cortex-A overview', href: '/docs/cortex-a/overview/' },
      { title: 'Boot flow & EL levels', href: '/docs/cortex-a/boot-and-exception-levels/' },
      { title: 'MMU & paging', href: '/docs/cortex-a/mmu/' },
      { title: 'Caches & coherency', href: '/docs/cortex-a/caches/' },
    ],
  },
  {
    title: 'Cortex-R',
    key: 'cortex-r',
    intro: 'Hard real-time, safety-critical. Lockstep cores, MPUs, tightly coupled memories.',
    links: [
      { title: 'Cortex-R overview', href: '/docs/cortex-r/overview/' },
      { title: 'Lockstep & ASIL', href: '/docs/cortex-r/lockstep/' },
    ],
  },
  {
    title: 'Peripherals',
    key: 'peripherals',
    intro: 'GPIO, UART, SPI, I²C, CAN, USB, Ethernet, DMA, ADC/DAC, timers — pattern-by-pattern.',
    links: [
      { title: 'GPIO', href: '/docs/peripherals/gpio/' },
      { title: 'UART', href: '/docs/peripherals/uart/' },
      { title: 'SPI', href: '/docs/peripherals/spi/' },
      { title: 'I²C', href: '/docs/peripherals/i2c/' },
      { title: 'CAN', href: '/docs/peripherals/can/' },
      { title: 'DMA', href: '/docs/peripherals/dma/' },
      { title: 'Timers & PWM', href: '/docs/peripherals/timers/' },
      { title: 'ADC / DAC', href: '/docs/peripherals/adc/' },
      { title: 'USB device', href: '/docs/peripherals/usb/' },
    ],
  },
  {
    title: 'Systems',
    key: 'systems',
    intro: 'How real products are built — Wi-Fi routers, smartwatches, drones, EV chargers, thermostats. Block diagrams, software stacks, design tradeoffs.',
    links: [
      { title: 'Overview', href: '/docs/systems/overview/' },
      { title: 'Wi-Fi router', href: '/docs/systems/wifi-router/' },
      { title: 'Smartwatch / fitness tracker', href: '/docs/systems/smartwatch/' },
      { title: 'Drone flight controller', href: '/docs/systems/drone-flight-controller/' },
      { title: 'EV charger', href: '/docs/systems/ev-charger/' },
      { title: 'Smart thermostat', href: '/docs/systems/smart-thermostat/' },
      { title: 'Automotive ECU', href: '/docs/systems/automotive-ecu/', badge: 'ASIL' },
      { title: 'Industrial motor drive', href: '/docs/systems/motor-drive/' },
    ],
  },
  {
    title: 'Programming',
    key: 'programming',
    intro: 'C, C++, Rust, assembly. Linker scripts, startup, CMSIS, low-level patterns.',
    links: [
      { title: 'Embedded C patterns', href: '/docs/programming/embedded-c/' },
      { title: 'CMSIS', href: '/docs/programming/cmsis/' },
      { title: 'Linker scripts', href: '/docs/programming/linker-scripts/' },
      { title: 'Startup & vector table', href: '/docs/programming/startup/' },
      { title: 'C++ on Cortex-M', href: '/docs/programming/cpp/' },
      { title: 'Rust on Cortex-M', href: '/docs/programming/rust/', badge: 'modern' },
      { title: 'Inline assembly', href: '/docs/programming/inline-asm/' },
    ],
  },
  {
    title: 'RTOS',
    key: 'rtos',
    intro: 'FreeRTOS, Zephyr, ThreadX, RT-Thread. Schedulers, IPC, tickless idle, priority inversion.',
    links: [
      { title: 'RTOS landscape', href: '/docs/rtos/landscape/' },
      { title: 'FreeRTOS', href: '/docs/rtos/freertos/' },
      { title: 'Zephyr', href: '/docs/rtos/zephyr/' },
      { title: 'ThreadX (Azure RTOS)', href: '/docs/rtos/threadx/' },
    ],
  },
  {
    title: 'Tools',
    key: 'tools',
    intro: 'Compilers, debuggers, probes, IDEs, build systems, simulators.',
    links: [
      { title: 'Toolchain (GCC/LLVM)', href: '/docs/tools/toolchains/' },
      { title: 'GDB & on-chip debug', href: '/docs/tools/gdb/' },
      { title: 'OpenOCD & probes', href: '/docs/tools/openocd/' },
      { title: 'Build systems', href: '/docs/tools/build/' },
      { title: 'QEMU & Renode', href: '/docs/tools/sim/' },
    ],
  },
  {
    title: 'Vendors',
    key: 'vendors',
    intro: 'STM32, NXP, Nordic, RP2040, Renesas, TI, Microchip, Silicon Labs, Infineon.',
    links: [
      { title: 'STM32 (ST)', href: '/docs/vendors/stm32/' },
      { title: 'NXP Kinetis & i.MX RT', href: '/docs/vendors/nxp/' },
      { title: 'Nordic nRF', href: '/docs/vendors/nordic/' },
      { title: 'Raspberry Pi RP2040 / RP2350', href: '/docs/vendors/raspberry/' },
      { title: 'Renesas RA / RX', href: '/docs/vendors/renesas/' },
      { title: 'TI Tiva / MSP432', href: '/docs/vendors/ti/' },
      { title: 'Microchip SAM', href: '/docs/vendors/microchip/' },
      { title: 'Silicon Labs EFM32 / EFR32', href: '/docs/vendors/silabs/' },
      { title: 'Infineon XMC / PSoC', href: '/docs/vendors/infineon/' },
    ],
  },
];

export function findSectionByKey(key: string) {
  return sections.find((s) => s.key === key);
}

export function flatLinks(): { section: NavSection; link: NavLink }[] {
  return sections.flatMap((s) => s.links.map((l) => ({ section: s, link: l })));
}
