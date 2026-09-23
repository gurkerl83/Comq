import type { EquipmentConfiguration, EquipmentEntry } from './types';

/**
 * Accept a non-null object before inspecting its fields.
 *
 * 1. Require an object value and exclude null.
 * 2. Reject arrays; this check does not restrict the object's prototype or fields.
 *
 * @param value - Unknown value whose fields may need further validation.
 * @returns True for a non-null, non-array object, narrowing its field values to unknown.
 *
 * @example
 * isRecord({ choices: {} }); // true
 * isRecord([]); // false
 * isRecord(null); // false
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Check whether an array contains duplicate values without changing it.
 *
 * 1. Compare the number of distinct values in a Set with the array length.
 * 2. Use Set equality, including reference identity for objects; an empty array passes.
 *
 * @param values - Values to compare for duplicates.
 * @returns True when every value is unique under Set equality.
 *
 * @example
 * hasUniqueValues([]); // true
 * hasUniqueValues(['rear-camera', 'central-lubrication']); // true
 * hasUniqueValues(['rear-camera', 'rear-camera']); // false
 */
function hasUniqueValues(values: readonly unknown[]): boolean {
  return new Set(values).size === values.length;
}

/**
 * Check one selected choice against the corresponding machine option.
 *
 * 1. Find the option by its ID; an unknown option is invalid, even for advice.
 * 2. Accept null as a request for advice, or a choice ID belonging to that option.
 *
 * @param machine - Catalogue entry defining the available options and choices.
 * @param optionId - Stable ID of the configurable aspect being answered.
 * @param selected - Candidate choice ID, or null when advice is requested.
 * @returns True when the option exists and its selected value is supported.
 *
 * @example
 * // For a machine whose only option is "power", offering "power-105":
 * isValidOptionSelection(machine, 'power', 'power-105'); // true
 * isValidOptionSelection(machine, 'power', null); // true
 * isValidOptionSelection(machine, 'width', null); // false
 */
function isValidOptionSelection(
  machine: EquipmentEntry,
  optionId: string,
  selected: unknown
): boolean {
  const option = machine.options.find(option => option.id === optionId);

  return (
    option !== undefined &&
    (selected === null || option.choices.some(choice => choice.id === selected))
  );
}

/**
 * Check the choice entries against all options authored for the machine.
 *
 * 1. Require a non-null, non-array object.
 * 2. Require as many own enumerable string-keyed entries as machine options.
 * 3. Validate each entry's option ID and selected value. With no options, an
 *    empty choices object passes.
 *
 * @param machine - Catalogue entry with uniquely identified options.
 * @param value - Candidate object mapping option IDs to selected values.
 * @returns True when the enumerated entries cover the machine's options with valid answers.
 *
 * @example
 * // For a machine whose only option is "power", offering "power-105":
 * hasValidChoices(machine, { power: 'power-105' }); // true
 * hasValidChoices(machine, { power: null }); // true
 * hasValidChoices(machine, {}); // false
 */
function hasValidChoices(machine: EquipmentEntry, value: unknown): boolean {
  if (!isRecord(value)) return false;

  const selections = Object.entries(value);

  return (
    selections.length === machine.options.length &&
    selections.every(([optionId, selected]) =>
      isValidOptionSelection(machine, optionId, selected)
    )
  );
}

/**
 * Check requested extras against the machine's available equipment.
 *
 * 1. Require an array and reject duplicate values.
 * 2. Check each present element against the machine's extra IDs.
 * 3. Accept an empty array, including when the machine offers no extras.
 *
 * @param machine - Catalogue entry defining the extras it supports.
 * @param value - Candidate array of requested extra IDs.
 * @returns True when the array passes the uniqueness and availability checks.
 *
 * @example
 * // For a machine offering only "rear-camera":
 * hasValidExtras(machine, []); // true
 * hasValidExtras(machine, ['rear-camera']); // true
 * hasValidExtras(machine, ['rear-camera', 'rear-camera']); // false
 * hasValidExtras(machine, ['central-lubrication']); // false
 */
function hasValidExtras(machine: EquipmentEntry, value: unknown): boolean {
  return (
    Array.isArray(value) &&
    hasUniqueValues(value) &&
    value.every(id => machine.extras.some(extra => extra.id === id))
  );
}

/**
 * Create a starting configuration from the machine's authored defaults.
 *
 * 1. Associate each option ID with its default choice ID.
 * 2. Initialize an empty extras array; extras are selected separately.
 * 3. Without a machine, return empty choices and extras. Authored defaults are
 *    copied as provided; this function does not validate them.
 *
 * @param machine - Optional catalogue entry supplying the starting choices.
 * @returns A new configuration containing default choice IDs and no requested extras.
 *
 * @example
 * createConfiguration();
 * // => { choices: {}, extras: [] }
 *
 * // For a machine whose only option is "power", defaulting to "power-105":
 * createConfiguration(machine);
 * // => { choices: { power: 'power-105' }, extras: [] }
 */
export function createConfiguration(
  machine?: EquipmentEntry
): EquipmentConfiguration {
  return {
    choices: Object.fromEntries(
      (machine?.options ?? []).map(option => [option.id, option.defaultChoice])
    ),
    extras: []
  };
}

/**
 * Validate a configuration's structure and selections against one machine.
 *
 * 1. Require a non-null, non-array object.
 * 2. Validate its choice entries against the machine's options.
 * 3. Validate its extras against the machine's available equipment.
 *    Additional top-level properties do not affect the result.
 *
 * @param machine - Catalogue entry defining the supported options and extras.
 * @param value - Unknown configuration to validate before applying it.
 * @returns True when all checks pass, narrowing value to EquipmentConfiguration.
 *
 * @example
 * // For a machine whose only option is "power", offering "power-105":
 * isValidConfiguration(machine, {
 *   choices: { power: 'power-105' },
 *   extras: []
 * }); // true
 * isValidConfiguration(machine, { choices: {}, extras: [] }); // false
 * isValidConfiguration(machine, null); // false
 */
export function isValidConfiguration(
  machine: EquipmentEntry,
  value: unknown
): value is EquipmentConfiguration {
  return (
    isRecord(value) &&
    hasValidChoices(machine, value.choices) &&
    hasValidExtras(machine, value.extras)
  );
}
