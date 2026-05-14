// Curated database of representative ARM Cortex-M parts.
// Not exhaustive — picks one or two flagship parts per family from each major vendor.

export type CoreKind = 'M0' | 'M0+' | 'M3' | 'M4' | 'M4F' | 'M7' | 'M23' | 'M33' | 'M55' | 'M85';
export type Wireless = 'none' | 'ble' | 'wifi' | 'thread' | 'lora' | 'sub-ghz' | 'matter' | '802.15.4' | 'mesh';
export type Vendor = 'STMicro' | 'Nordic' | 'Raspberry Pi' | 'NXP' | 'Silicon Labs' | 'TI' | 'Microchip' | 'Renesas' | 'Espressif' | 'Infineon';

export type Mcu = {
  id: string;
  family: string;
  vendor: Vendor;
  core: CoreKind;
  mhz: number;
  flashKB: number;
  ramKB: number;
  pinMin: number;
  pinMax: number;
  wireless: Wireless[];
  features: ('FPU' | 'DSP' | 'TrustZone' | 'Helium' | 'Cache' | 'TCM' | 'Crypto' | 'USB' | 'Ethernet' | 'CAN' | 'CAN-FD')[];
  /** Power envelope intent — informal categorisation. */
  power: 'ultra-low' | 'low' | 'general' | 'high-perf';
  /** Ballpark unit price in USD at low volume — rounded, not authoritative. */
  priceUsd: number;
  blurb: string;
  /** Link out to vendor product page or our deep dive. */
  vendorUrl?: string;
  docUrl?: string;
};

export const mcus: Mcu[] = [
  // ── STM32
  { id: 'stm32c011', family: 'STM32C0', vendor: 'STMicro', core: 'M0+', mhz: 48, flashKB: 32, ramKB: 6, pinMin: 20, pinMax: 32, wireless: ['none'], features: [], power: 'low', priceUsd: 0.30, blurb: 'Lowest-cost STM32, 8-bit replacement class.', docUrl: '/docs/vendors/stm32' },
  { id: 'stm32g030', family: 'STM32G0', vendor: 'STMicro', core: 'M0+', mhz: 64, flashKB: 64, ramKB: 8, pinMin: 20, pinMax: 64, wireless: ['none'], features: ['USB'], power: 'low', priceUsd: 0.80, blurb: 'Modern mainstream entry STM32.', docUrl: '/docs/vendors/stm32' },
  { id: 'stm32f103', family: 'STM32F1', vendor: 'STMicro', core: 'M3', mhz: 72, flashKB: 128, ramKB: 20, pinMin: 36, pinMax: 144, wireless: ['none'], features: ['USB', 'CAN'], power: 'general', priceUsd: 2.50, blurb: 'Classic legacy mid-range. Still ships in volumes.', docUrl: '/docs/cortex-m/m3' },
  { id: 'stm32f411', family: 'STM32F4', vendor: 'STMicro', core: 'M4F', mhz: 100, flashKB: 512, ramKB: 128, pinMin: 48, pinMax: 100, wireless: ['none'], features: ['FPU', 'DSP', 'USB'], power: 'general', priceUsd: 4.50, blurb: 'The M4 workhorse — biggest ecosystem of any STM32.', docUrl: '/docs/cortex-m/m4' },
  { id: 'stm32g474', family: 'STM32G4', vendor: 'STMicro', core: 'M4F', mhz: 170, flashKB: 512, ramKB: 128, pinMin: 32, pinMax: 100, wireless: ['none'], features: ['FPU', 'DSP', 'USB', 'CAN-FD'], power: 'general', priceUsd: 6.50, blurb: 'Motor-control flagship — HRTIM, CORDIC, FMAC.', docUrl: '/docs/systems/motor-drive' },
  { id: 'stm32h723', family: 'STM32H7', vendor: 'STMicro', core: 'M7', mhz: 550, flashKB: 1024, ramKB: 564, pinMin: 64, pinMax: 240, wireless: ['none'], features: ['FPU', 'DSP', 'Cache', 'TCM', 'USB', 'Ethernet', 'CAN-FD', 'Crypto'], power: 'high-perf', priceUsd: 12.00, blurb: 'High-perf M7 — caches, TCMs, Ethernet, 550 MHz.', docUrl: '/docs/cortex-m/m7' },
  { id: 'stm32u575', family: 'STM32U5', vendor: 'STMicro', core: 'M33', mhz: 160, flashKB: 2048, ramKB: 786, pinMin: 48, pinMax: 169, wireless: ['none'], features: ['FPU', 'DSP', 'TrustZone', 'USB', 'Crypto'], power: 'ultra-low', priceUsd: 6.00, blurb: 'Modern secure low-power M33 — TrustZone-first.', docUrl: '/docs/cortex-m/m33-m23' },
  { id: 'stm32wb55', family: 'STM32WB', vendor: 'STMicro', core: 'M4F', mhz: 64, flashKB: 1024, ramKB: 256, pinMin: 48, pinMax: 100, wireless: ['ble', '802.15.4', 'thread'], features: ['FPU', 'USB', 'Crypto'], power: 'low', priceUsd: 5.00, blurb: 'Dual-core BLE / Thread / Zigbee STM32.', docUrl: '/docs/vendors/stm32' },

  // ── Nordic
  { id: 'nrf52810', family: 'nRF52', vendor: 'Nordic', core: 'M4', mhz: 64, flashKB: 192, ramKB: 24, pinMin: 32, pinMax: 48, wireless: ['ble'], features: [], power: 'ultra-low', priceUsd: 2.00, blurb: 'Cost-optimised BLE for sensor tags.', docUrl: '/docs/vendors/nordic' },
  { id: 'nrf52840', family: 'nRF52', vendor: 'Nordic', core: 'M4F', mhz: 64, flashKB: 1024, ramKB: 256, pinMin: 48, pinMax: 73, wireless: ['ble', '802.15.4', 'thread', 'mesh'], features: ['FPU', 'USB', 'Crypto'], power: 'ultra-low', priceUsd: 4.00, blurb: 'The default high-end BLE chip. Powers a billion-plus devices.', docUrl: '/docs/vendors/nordic' },
  { id: 'nrf5340', family: 'nRF53', vendor: 'Nordic', core: 'M33', mhz: 128, flashKB: 1024, ramKB: 512, pinMin: 48, pinMax: 76, wireless: ['ble', '802.15.4', 'thread', 'matter'], features: ['FPU', 'DSP', 'TrustZone', 'USB', 'Crypto'], power: 'ultra-low', priceUsd: 6.00, blurb: 'Dual-M33 + BLE 5.4. Wearables & smart-home gateway class.', docUrl: '/docs/systems/smartwatch' },
  { id: 'nrf9160', family: 'nRF91', vendor: 'Nordic', core: 'M33', mhz: 64, flashKB: 1024, ramKB: 256, pinMin: 30, pinMax: 60, wireless: ['ble'], features: ['FPU', 'DSP', 'TrustZone'], power: 'low', priceUsd: 25.00, blurb: 'Cellular LTE-M / NB-IoT with integrated M33.', docUrl: '/docs/vendors/nordic' },

  // ── Raspberry Pi
  { id: 'rp2040', family: 'RP2040', vendor: 'Raspberry Pi', core: 'M0+', mhz: 133, flashKB: 0, ramKB: 264, pinMin: 30, pinMax: 30, wireless: ['none'], features: ['USB'], power: 'general', priceUsd: 1.00, blurb: 'Dual-M0+ with PIO. No internal flash; needs external QSPI.', docUrl: '/docs/vendors/raspberry' },
  { id: 'rp2350', family: 'RP2350', vendor: 'Raspberry Pi', core: 'M33', mhz: 150, flashKB: 0, ramKB: 520, pinMin: 30, pinMax: 47, wireless: ['none'], features: ['TrustZone', 'USB'], power: 'general', priceUsd: 1.50, blurb: 'M33 + Hazard3 RISC-V (switchable), PIO ×12, TrustZone.', docUrl: '/docs/vendors/raspberry' },

  // ── NXP
  { id: 'lpc55s28', family: 'LPC55', vendor: 'NXP', core: 'M33', mhz: 150, flashKB: 512, ramKB: 256, pinMin: 49, pinMax: 100, wireless: ['none'], features: ['FPU', 'TrustZone', 'USB', 'CAN-FD', 'Crypto'], power: 'general', priceUsd: 4.00, blurb: 'M33 + PowerQuad DSP coprocessor.', docUrl: '/docs/vendors/nxp' },
  { id: 'imxrt1062', family: 'i.MX RT1060', vendor: 'NXP', core: 'M7', mhz: 600, flashKB: 0, ramKB: 1024, pinMin: 144, pinMax: 196, wireless: ['none'], features: ['FPU', 'DSP', 'Cache', 'TCM', 'USB', 'Ethernet', 'CAN-FD', 'Crypto'], power: 'high-perf', priceUsd: 7.00, blurb: 'Crossover MCU — 600 MHz M7, external QSPI, Linux-class perf.', docUrl: '/docs/vendors/nxp' },
  { id: 'imxrt700', family: 'i.MX RT700', vendor: 'NXP', core: 'M85', mhz: 325, flashKB: 0, ramKB: 7424, pinMin: 100, pinMax: 290, wireless: ['none'], features: ['FPU', 'DSP', 'Helium', 'Cache', 'TCM', 'USB', 'CAN-FD', 'Crypto'], power: 'high-perf', priceUsd: 25.00, blurb: 'Cortex-M85 with NPU for edge ML inference.', docUrl: '/docs/cortex-m/m55-m85' },

  // ── Silicon Labs
  { id: 'efr32mg24', family: 'EFR32MG24', vendor: 'Silicon Labs', core: 'M33', mhz: 78, flashKB: 1024, ramKB: 256, pinMin: 40, pinMax: 64, wireless: ['ble', '802.15.4', 'thread', 'matter', 'mesh'], features: ['FPU', 'DSP', 'TrustZone', 'Crypto'], power: 'ultra-low', priceUsd: 4.50, blurb: 'Matter / Thread flagship — used in connected-lighting & locks.', docUrl: '/docs/vendors/silabs' },
  { id: 'efm32pg23', family: 'EFM32 PG23', vendor: 'Silicon Labs', core: 'M33', mhz: 80, flashKB: 512, ramKB: 64, pinMin: 32, pinMax: 48, wireless: ['none'], features: ['FPU', 'TrustZone', 'Crypto'], power: 'ultra-low', priceUsd: 3.00, blurb: 'Energy-friendly Series 2 — sub-µA sleep.', docUrl: '/docs/vendors/silabs' },

  // ── Renesas
  { id: 'ra8m1', family: 'RA8M1', vendor: 'Renesas', core: 'M85', mhz: 480, flashKB: 2048, ramKB: 1024, pinMin: 144, pinMax: 224, wireless: ['none'], features: ['FPU', 'DSP', 'Helium', 'Cache', 'TCM', 'USB', 'Ethernet', 'CAN-FD', 'Crypto'], power: 'high-perf', priceUsd: 12.00, blurb: 'First-gen M85, Helium for ML.', docUrl: '/docs/cortex-m/m55-m85' },
  { id: 'ra6m4', family: 'RA6', vendor: 'Renesas', core: 'M33', mhz: 200, flashKB: 1024, ramKB: 256, pinMin: 64, pinMax: 144, wireless: ['none'], features: ['FPU', 'DSP', 'TrustZone', 'USB', 'Ethernet', 'CAN-FD', 'Crypto'], power: 'general', priceUsd: 5.00, blurb: 'Mainstream M33 with strong networking.', docUrl: '/docs/vendors/renesas' },

  // ── TI
  { id: 'tm4c123', family: 'Tiva-C', vendor: 'TI', core: 'M4F', mhz: 80, flashKB: 256, ramKB: 32, pinMin: 64, pinMax: 144, wireless: ['none'], features: ['FPU', 'DSP', 'USB', 'CAN'], power: 'general', priceUsd: 10.00, blurb: 'TI\'s mid-range M4 (formerly Stellaris).', docUrl: '/docs/vendors/ti' },
  { id: 'cc2652r', family: 'SimpleLink', vendor: 'TI', core: 'M4F', mhz: 48, flashKB: 352, ramKB: 80, pinMin: 31, pinMax: 48, wireless: ['ble', '802.15.4', 'thread', 'matter', 'mesh'], features: ['FPU', 'DSP', 'Crypto'], power: 'ultra-low', priceUsd: 5.50, blurb: 'TI\'s BLE + Thread/Zigbee wireless MCU.', docUrl: '/docs/vendors/ti' },

  // ── Microchip
  { id: 'samd21', family: 'SAM D21', vendor: 'Microchip', core: 'M0+', mhz: 48, flashKB: 256, ramKB: 32, pinMin: 32, pinMax: 64, wireless: ['none'], features: ['USB'], power: 'low', priceUsd: 3.00, blurb: 'Hobbyist favourite — Adafruit Feather class.', docUrl: '/docs/vendors/microchip' },
  { id: 'same54', family: 'SAM E54', vendor: 'Microchip', core: 'M4F', mhz: 120, flashKB: 1024, ramKB: 256, pinMin: 64, pinMax: 128, wireless: ['none'], features: ['FPU', 'DSP', 'USB', 'Ethernet', 'CAN-FD', 'Crypto'], power: 'general', priceUsd: 6.50, blurb: 'Industrial M4F with Ethernet and CAN-FD.', docUrl: '/docs/vendors/microchip' },

  // ── Espressif
  { id: 'esp32-c6', family: 'ESP32-C6', vendor: 'Espressif', core: 'M4', mhz: 160, flashKB: 4096, ramKB: 512, pinMin: 30, pinMax: 30, wireless: ['wifi', 'ble', 'thread', 'matter', '802.15.4'], features: ['Crypto'], power: 'low', priceUsd: 2.00, blurb: 'Wi-Fi 6 + BLE + Thread/Matter. RISC-V actually, listed for completeness.', docUrl: '/docs/systems/smart-thermostat' },

  // ── Infineon
  { id: 'xmc4700', family: 'XMC4700', vendor: 'Infineon', core: 'M4F', mhz: 144, flashKB: 2048, ramKB: 352, pinMin: 100, pinMax: 196, wireless: ['none'], features: ['FPU', 'DSP', 'USB', 'Ethernet', 'CAN', 'Crypto'], power: 'general', priceUsd: 10.00, blurb: 'Industrial motor-control M4F.', docUrl: '/docs/vendors/infineon' },
  { id: 'psoc6', family: 'PSoC 6', vendor: 'Infineon', core: 'M4F', mhz: 150, flashKB: 1024, ramKB: 288, pinMin: 64, pinMax: 124, wireless: ['ble'], features: ['FPU', 'DSP', 'TrustZone', 'USB', 'Crypto'], power: 'low', priceUsd: 8.00, blurb: 'Dual-core M4F + M0+ with programmable analogue.', docUrl: '/docs/vendors/infineon' },
];
