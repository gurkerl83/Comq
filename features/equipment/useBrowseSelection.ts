import { useEffect, useEffectEvent, useState } from 'react';

import { useQueryParam } from '../../lib/navigation/useQueryParam';
import {
  getMachineTabs,
  readMachineTab,
  type MachineTab
} from './machine-tabs';
import type { EquipmentEntry } from './types';

/** The address parameter that names the machine in the catalogue preview. */
export const BROWSE_MACHINE_PARAM = 'machine';

/** The address parameter that names the preview's tab. */
export const BROWSE_TAB_PARAM = 'tab';

/** The machine the catalogue preview shows, and its tab. */
type BrowseSelection = {
  /** The machine in the preview; undefined only while the list is empty. */
  machine: EquipmentEntry | undefined;
  /** The preview's tab, one the machine has content for. */
  tab: MachineTab;
};

/**
 * The machine the catalogue preview shows and its tab, kept in the page
 * address and the browser history. It follows useSelectionStep: a click
 * shows its choice at once (fast path), and Back or Forward show what the
 * address names (slow path).
 *
 * 1. The address names the machine in BROWSE_MACHINE_PARAM and the tab in
 *    BROWSE_TAB_PARAM: ?machine=demo-jumbo-j1&tab=options.
 *    The first machine and the specifications tab stay out of the address.
 * 2. selectMachine and selectTab add a history entry, so Back returns to the
 *    machine or tab shown before.
 * 3. A machine that doesn't exist shows the first machine, and a tab the
 *    machine has no content for shows its specifications; the address is
 *    corrected in place.
 *
 * @param machines - The machines in catalogue order.
 * @returns The machine and its tab, the tabs it has, selectMachine and
 *   selectTab.
 */
export function useBrowseSelection(machines: EquipmentEntry[]) {
  const {
    value: requestedMachine,
    push: pushMachine,
    replace: replaceMachine
  } = useQueryParam(BROWSE_MACHINE_PARAM);
  const {
    value: requestedTab,
    push: pushTab,
    replace: replaceTab
  } = useQueryParam(BROWSE_TAB_PARAM);
  const [firstMachine] = machines;

  /**
   * The tab to show on a machine: the wanted one when the machine has
   * content for it, otherwise the specifications.
   *
   * @param machine - The machine, or undefined while the list is empty.
   * @param wanted - The tab wanted, or null.
   * @returns A tab the machine has.
   */
  function getAvailableTab(
    machine: EquipmentEntry | undefined,
    wanted: MachineTab | null
  ): MachineTab {
    if (machine && wanted && getMachineTabs(machine).includes(wanted)) {
      return wanted;
    }
    return 'specifications';
  }

  /**
   * The machine and tab to show for what the address names.
   *
   * @param machineValue - The machine slug the address names, or null.
   * @param tabValue - The tab the address names, or null.
   * @returns The named machine and tab, or the first machine and the
   *   specifications where the address names none or one that doesn't exist.
   */
  function getSelectionFromAddress(
    machineValue: string | null,
    tabValue: string | null
  ): BrowseSelection {
    const machine =
      machines.find(entry => entry.slug === machineValue) ?? firstMachine;
    return { machine, tab: getAvailableTab(machine, readMachineTab(tabValue)) };
  }

  /**
   * The value of BROWSE_MACHINE_PARAM for a machine.
   * The first machine gets null, which leaves the parameter out.
   *
   * @param machine - The machine the address names.
   * @returns null for the first machine, otherwise its slug.
   */
  function getMachineParamValue(
    machine: EquipmentEntry | undefined
  ): string | null {
    if (!machine || machine === firstMachine) return null;
    return machine.slug;
  }

  /**
   * The value of BROWSE_TAB_PARAM for a tab.
   * The specifications get null, which leaves the parameter out.
   *
   * @param tab - The tab the address names.
   * @returns null for the specifications, otherwise the tab.
   */
  function getTabParamValue(tab: MachineTab): string | null {
    if (tab === 'specifications') return null;
    return tab;
  }

  const [selection, setSelection] = useState(() =>
    getSelectionFromAddress(requestedMachine, requestedTab)
  );

  /**
   * Show another machine in the preview and add a history entry for it.
   * The tab stays when the machine has content for it.
   *
   * @param slug - The machine to show.
   */
  function selectMachine(slug: string) {
    const machine = machines.find(entry => entry.slug === slug) ?? firstMachine;
    const tab = getAvailableTab(machine, selection.tab);
    // Fast path: show the machine in the click's own render.
    setSelection({ machine, tab });
    // Record the machine in the history; the address follows one render later.
    pushMachine(getMachineParamValue(machine));
    // The new entry still names the old tab; correct it when the tab changed.
    if (tab !== selection.tab) replaceTab(getTabParamValue(tab));
  }

  /**
   * Show another tab of the machine and add a history entry for it.
   *
   * @param tab - The tab to show.
   */
  function selectTab(tab: MachineTab) {
    // Fast path: show the tab in the click's own render.
    setSelection({ machine: selection.machine, tab });
    // Record the tab in the history; the address follows one render later.
    pushTab(getTabParamValue(tab));
  }

  /**
   * Show what the address names, and keep the address honest.
   * It runs whenever the address's machine or tab changes: after the
   * browser's Back or Forward, after a click and once after a full page
   * load. useEffectEvent lets it read the current selection without making
   * the selection a dependency; useSelectionStep explains why that matters.
   *
   * @param machineValue - The machine slug the address names, or null.
   * @param tabValue - The tab the address names, or null.
   */
  const onRequestedChange = useEffectEvent(
    (machineValue: string | null, tabValue: string | null) => {
      const target = getSelectionFromAddress(machineValue, tabValue);
      const targetMachineValue = getMachineParamValue(target.machine);
      const targetTabValue = getTabParamValue(target.tab);
      // Correction: replace the address only where it names something else.
      if (machineValue !== targetMachineValue) {
        replaceMachine(targetMachineValue);
      }
      if (tabValue !== targetTabValue) replaceTab(targetTabValue);
      // Already shown, as after a click or a full page load.
      if (
        target.machine === selection.machine &&
        target.tab === selection.tab
      ) {
        return;
      }
      // Slow path: Back or Forward reached another machine or tab.
      setSelection(target);
    }
  );

  // Follow the machine and tab the address names whenever they change.
  useEffect(() => {
    onRequestedChange(requestedMachine, requestedTab);
  }, [requestedMachine, requestedTab]);

  return {
    machine: selection.machine,
    tab: selection.tab,
    tabs: selection.machine ? getMachineTabs(selection.machine) : [],
    selectMachine,
    selectTab
  };
}
