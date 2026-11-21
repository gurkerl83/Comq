import type { EquipmentEntry } from './types';

/**
 * The parts of a machine's details, in display order. The machine page shows
 * them as sections, the catalogue preview as tabs.
 * 1. specifications: the application and the specification table.
 * 2. range: the range drawings.
 * 3. comq: how the COMQ version differs from the factory model.
 * 4. options: the options and the optional extras.
 */
export const MACHINE_TABS = [
  'specifications',
  'range',
  'comq',
  'options'
] as const;

/** One part of a machine's details; see MACHINE_TABS. */
export type MachineTab = (typeof MACHINE_TABS)[number];

/**
 * The parts a machine has content for, in display order. Every machine has
 * specifications; the others need drawings, COMQ-version rows, or options or
 * extras.
 *
 * @param machine - The machine whose parts to list.
 * @returns The machine's parts, specifications first.
 */
export function getMachineTabs(machine: EquipmentEntry): MachineTab[] {
  const tabs: MachineTab[] = ['specifications'];
  if (machine.drawings.length > 0) tabs.push('range');
  if (machine.comqVersion.length > 0) tabs.push('comq');
  if (machine.options.length > 0 || machine.extras.length > 0) {
    tabs.push('options');
  }
  return tabs;
}

/**
 * Read a part's name, such as an address value.
 *
 * @param value - The text to read, or null.
 * @returns The part it names, or null for anything else.
 */
export function readMachineTab(value: string | null): MachineTab | null {
  return MACHINE_TABS.find(tab => tab === value) ?? null;
}
