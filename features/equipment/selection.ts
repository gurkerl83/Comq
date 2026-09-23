import type { SupportedLocale } from '../../lib/i18n/locales';
import type {
  EquipmentEntry,
  EquipmentConfiguration,
  EquipmentExtra,
  EquipmentOption
} from './types';
import { createConfiguration } from './configuration';
import type { SelectorContent } from './selector-content';
import { SelectionStep, SELECTION_STEP_ORDER } from './selection-steps';
import { SELECTION_LIMITS } from './selection-limits';

/**
 * The visitor's requested supply option; COMQ confirms availability and terms.
 */
export const AcquisitionMode = {
  Purchase: 'purchase',
  Rental: 'rental'
} as const;

export type AcquisitionMode =
  (typeof AcquisitionMode)[keyof typeof AcquisitionMode];

export interface EquipmentSelection {
  category: EquipmentEntry['category'] | '';
  machine: string;
  /** Applied machine choices; temporary edits stay outside the enquiry. */
  configuration: EquipmentConfiguration;
  acquisition: AcquisitionMode;
  quantity: string;
  country: string;
  projectLocation: string;
  rentalDuration: string;
  rentalUnit: 'weeks' | 'months';
  startDate: string;
  notes: string;
}

/**
 * Start a new enquiry with Purchase selected. A direct machine-page link
 * preselects only a known catalogue entry; it does not determine the mode.
 */
export function createSelection(
  catalogue: EquipmentEntry[],
  slug: string | null
): EquipmentSelection {
  const selection: EquipmentSelection = {
    category: '',
    machine: '',
    configuration: createConfiguration(),
    acquisition: AcquisitionMode.Purchase,
    quantity: SELECTION_LIMITS.quantity.min.toString(10),
    country: '',
    projectLocation: '',
    rentalDuration: '',
    rentalUnit: 'months',
    startDate: '',
    notes: ''
  };

  const machine = catalogue.find(entry => entry.slug === slug);
  if (!machine) return selection;

  return {
    ...selection,
    category: machine.category,
    machine: machine.slug,
    configuration: createConfiguration(machine)
  };
}

/**
 * Choose the starting step once, when the wizard initializes its state.
 * createSelection has already resolved the URL's machine against the catalogue:
 * 1. A recognized machine supplies both equipment answers, so start at Machine to review its options.
 * 2. Otherwise use the first step in the shared sequence to choose equipment.
 *
 * Example: ?machine=demo-jumbo-j1 opens Machine; an unknown slug starts
 * at Category. Later equipment changes leave navigation to the wizard.
 */
export function getInitialSelectionStep(
  selection: EquipmentSelection
): SelectionStep {
  if (selection.machine) return SelectionStep.Machine;
  const [firstStep] = SELECTION_STEP_ORDER;
  return firstStep;
}

/**
 * Change equipment category while keeping the visitor's enquiry answers.
 * 1. Selecting the current category keeps the draft, including its configuration.
 * 2. A different category clears that configuration and selects its only machine
 *    automatically. With zero or several matches, the machine stays empty.
 * 3. Purchase/rental preference, quantity, location, rental details and notes stay
 *    in the returned draft; the supplied draft is never mutated.
 *
 * Example: switching from Jumbos to Scooptrams retains a six-week rental request,
 * but does not carry over the Jumbo's configuration.
 */
export function selectCategory(
  selection: EquipmentSelection,
  catalogue: EquipmentEntry[],
  category: EquipmentSelection['category']
): EquipmentSelection {
  if (category === selection.category) return selection;
  const options = catalogue.filter(entry => entry.category === category);
  const [onlyMachine] = options;
  let machine = '';
  if (options.length === 1 && onlyMachine) machine = onlyMachine.slug;
  return {
    ...selection,
    category,
    machine,
    configuration: createConfiguration(machine ? onlyMachine : undefined)
  };
}

/**
 * Choose another machine within the active category, preserving enquiry answers.
 * 1. Keep the existing draft for the same machine, an unknown slug or a machine
 *    from another category.
 * 2. For an accepted change, return a new draft with the chosen machine and a
 *    configuration seeded from that machine's defaults.
 *
 * Example: J1 to J2 keeps Rental, quantity and project details, and resets the
 * configuration to the new machine's defaults. The wizard still owns step navigation.
 */
export function selectMachine(
  selection: EquipmentSelection,
  catalogue: EquipmentEntry[],
  slug: EquipmentSelection['machine']
): EquipmentSelection {
  if (slug === selection.machine) return selection;
  const entry = catalogue.find(
    candidate =>
      candidate.slug === slug && candidate.category === selection.category
  );
  if (!entry) return selection;
  return {
    ...selection,
    machine: entry.slug,
    configuration: createConfiguration(entry)
  };
}

/**
 * One formatted answer shared by Review and the WhatsApp enquiry.
 *
 * Multiple configuration rows share the same field and edit step, while their
 * labels identify individual options or the optional equipment summary.
 */
type SelectionSummaryRow = {
  /**
   * Selection field used to group the answer in the enquiry.
   */
  field: keyof EquipmentSelection;
  /**
   * Localized heading shown beside the answer.
   */
  label: string;
  /**
   * Formatted answer, including any relevant units or default information.
   */
  value: string;
  /**
   * Wizard step opened by the row's Edit action.
   */
  step: SelectionStep;
};

/**
 * Format the numeric duration with the locale's unit name and plural rules.
 * Example: 1 month / 2 months in English; 1 mes / 2 meses in Spanish.
 * Incomplete drafts stay unchanged while the visitor is editing.
 */
function formatRentalDuration(
  locale: SupportedLocale,
  value: string,
  unit: EquipmentSelection['rentalUnit']
) {
  if (!/^\d+$/.test(value)) return value;
  const units = { weeks: 'week', months: 'month' };
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: units[unit],
    unitDisplay: 'long'
  }).format(parseInt(value, 10));
}

/**
 * Display a calendar date without shifting it to another day.
 * Parse and format in UTC so 2026-09-30 stays September 30 in every timezone.
 * Keep unparseable drafts unchanged; field rules still check calendar validity.
 */
function formatStartDate(locale: SupportedLocale, value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeZone: 'UTC'
  }).format(date);
}

/**
 * Build the ordered answers shared by Review and the WhatsApp enquiry.
 *
 * 1. Start with category and machine, followed by configuration, acquisition,
 *    quantity and country.
 * 2. Append nonblank project details, rental fields when renting, and nonblank
 *    notes. Include the optional rental start date only when provided.
 * 3. Resolve translated labels and format dates and durations without changing
 *    the selection. Validation remains the caller's responsibility.
 *
 * @param locale - Locale used to format rental durations and dates.
 * @param selection - Current enquiry answers, including the applied configuration.
 * @param machine - Catalogue entry matching the selected machine.
 * @param translations - Localized labels, country names and fallback messages.
 * @returns A new array of formatted answers in Review display order.
 *
 * @example
 * // A purchase enquiry with one option, offered extras and no optional text:
 * // category -> machine -> configuration (option) -> configuration (extras)
 * // -> acquisition -> quantity -> country
 * // Changing to Rental also adds duration and a start date when provided.
 */
export function getSelectionSummary(
  locale: SupportedLocale,
  selection: EquipmentSelection,
  machine: EquipmentEntry,
  translations: SelectorContent
) {
  const country = translations.countries.find(
    option => option.code === selection.country
  );
  let countryName = translations.notSpecified;
  if (country) countryName = country.name;

  const rows: SelectionSummaryRow[] = [
    {
      field: 'category',
      label: translations.category,
      value: machine.categoryName,
      step: SelectionStep.Category
    },
    {
      field: 'machine',
      label: translations.machine,
      value: machine.name,
      step: SelectionStep.Machine
    },
    ...getConfigurationSummaryRows(
      machine,
      selection.configuration,
      translations
    ),
    {
      field: 'acquisition',
      label: translations.acquisition,
      value: translations[selection.acquisition],
      step: SelectionStep.Requirements
    },
    {
      field: 'quantity',
      label: translations.quantity,
      value: selection.quantity,
      step: SelectionStep.Requirements
    },
    {
      field: 'country',
      label: translations.country,
      value: countryName,
      step: SelectionStep.Requirements
    }
  ];
  const projectLocation = selection.projectLocation.trim();
  if (projectLocation) {
    rows.push({
      field: 'projectLocation',
      label: translations.projectLocation,
      value: projectLocation,
      step: SelectionStep.Requirements
    });
  }
  if (selection.acquisition === AcquisitionMode.Rental) {
    rows.push({
      field: 'rentalDuration',
      label: translations.duration,
      value: formatRentalDuration(
        locale,
        selection.rentalDuration,
        selection.rentalUnit
      ),
      step: SelectionStep.Requirements
    });
    if (selection.startDate)
      rows.push({
        field: 'startDate',
        label: translations.startDate,
        value: formatStartDate(locale, selection.startDate),
        step: SelectionStep.Requirements
      });
  }
  if (selection.notes.trim())
    rows.push({
      field: 'notes',
      label: translations.requirements,
      value: selection.notes.trim(),
      step: SelectionStep.Requirements
    });
  return rows;
}

/**
 * Build summary rows for the machine's applied configuration.
 *
 * 1. Create one row per option, preserving catalogue order.
 * 2. Append an extras row only when the machine offers extras, including when
 *    none are selected.
 * 3. Associate every row with the configuration field and Machine edit step.
 *    This function formats answers; it does not validate the configuration.
 *
 * @param machine - Catalogue entry defining the available options and extras.
 * @param configuration - Applied choice IDs and selected extra IDs.
 * @param translations - Localized option status and extras labels.
 * @returns New configuration rows, or an empty array for a machine with no options
 * or extras.
 *
 * @example
 * // Machine offers Power (default: 105 kW) and a rear camera.
 * // Requesting 120 kW and no extras with English translations produces:
 * // Power: "120 kW (Default: 105 kW)"
 * // Optional equipment: "None requested"
 */
function getConfigurationSummaryRows(
  machine: EquipmentEntry,
  configuration: EquipmentConfiguration,
  translations: SelectorContent
): SelectionSummaryRow[] {
  const rows: SelectionSummaryRow[] = machine.options.map(option => ({
    field: 'configuration',
    label: option.label,
    value: formatOptionSelection(
      option,
      configuration.choices[option.id],
      translations
    ),
    step: SelectionStep.Machine
  }));

  if (machine.extras.length > 0) {
    rows.push({
      field: 'configuration',
      label: translations.optionalEquipment,
      value: formatSelectedExtras(
        machine.extras,
        configuration.extras,
        translations.noExtras
      ),
      step: SelectionStep.Machine
    });
  }

  return rows;
}

/**
 * Format an option selection together with its default information.
 *
 * 1. Resolve the selected choice's label. Null requests advice; missing or
 *    unknown IDs use the translated "not specified" text.
 * 2. When the selected ID is the default, append only the default marker.
 * 3. Otherwise append the default choice's label, including for advice requests
 *    and missing selections. The catalogue must define a valid default choice.
 *
 * @param option - Catalogue option containing the choices and default choice ID.
 * @param selected - Choice ID, null for advice, or undefined for a missing answer.
 * @param translations - Localized advice, fallback and default labels.
 * @returns The answer followed by its default information in parentheses.
 *
 * @example
 * // For an option offering power-105 (105 kW, default) and power-120 (120 kW),
 * // using English translations:
 * // "power-105" -> "105 kW (Default)"
 * // "power-120" -> "120 kW (Default: 105 kW)"
 * // null        -> "Advice requested (Default: 105 kW)"
 * // undefined   -> "Not specified (Default: 105 kW)"
 */
function formatOptionSelection(
  option: EquipmentOption,
  selected: string | null | undefined,
  translations: SelectorContent
): string {
  const selectedLabel =
    selected === null
      ? translations.advice
      : (option.choices.find(choice => choice.id === selected)?.label ??
        translations.notSpecified);

  if (selected === option.defaultChoice) {
    return `${selectedLabel} (${translations.defaultValue})`;
  }

  const defaultLabel = option.choices.find(
    choice => choice.id === option.defaultChoice
  )?.label;

  return `${selectedLabel} (${translations.defaultValue}: ${defaultLabel})`;
}

/**
 * Format the selected extras as a comma-separated list.
 *
 * 1. Keep catalogue extras whose IDs appear in the selection, preserving
 *    catalogue order rather than selection order. Unknown IDs are ignored.
 * 2. Join their labels with commas, or return the supplied fallback when the
 *    joined text is empty.
 *
 * @param extras - Available extras with localized labels, in display order.
 * @param selectedIds - Requested extra IDs.
 * @param noExtrasLabel - Localized text used when no labels can be displayed.
 * @returns Selected labels joined by ", ", or the supplied fallback text.
 *
 * @example
 * formatSelectedExtras(
 *   [{ id: 'camera', label: 'Rear camera' }],
 *   ['camera'],
 *   'None requested'
 * );
 * // => "Rear camera"
 *
 * formatSelectedExtras([], [], 'None requested');
 * // => "None requested"
 */
function formatSelectedExtras(
  extras: EquipmentExtra[],
  selectedIds: string[],
  noExtrasLabel: string
): string {
  return (
    extras
      .filter(extra => selectedIds.includes(extra.id))
      .map(extra => extra.label)
      .join(', ') || noExtrasLabel
  );
}

/**
 * Arrange the review's values into a WhatsApp enquiry with compact labels.
 *
 * 1. Use stable field IDs to group rows; translated labels are display text.
 * 2. The request heading states the visitor's purchase/rental preference.
 *    Rental rows are already omitted from the summary when purchasing.
 * 3. Skip missing optional rows and keep additional requirements as free text.
 *
 * Single asterisks mark bold headings; blank lines separate message sections.
 */
export function createEnquiryMessage(
  rows: ReturnType<typeof getSelectionSummary>,
  acquisition: EquipmentSelection['acquisition'],
  isDemo: boolean,
  translations: SelectorContent
) {
  const { message } = translations;
  const blocks: string[] = [];

  if (isDemo) {
    blocks.push(`*${message.demoTitle}*\n${message.demoNotice}`);
  }
  blocks.push(message.introduction);

  const sections: Array<{
    title: string;
    fields: Array<keyof SelectorContent['message']['labels']>;
  }> = [
    {
      title: message.equipment,
      fields: ['category', 'machine']
    },
    {
      title: message[acquisition],
      fields: ['quantity', 'rentalDuration', 'startDate']
    },
    {
      title: message.location,
      fields: ['country', 'projectLocation']
    }
  ];

  for (const { title, fields } of sections) {
    const lines: string[] = [];
    for (const field of fields) {
      const row = rows.find(entry => entry.field === field);
      if (!row) continue;
      lines.push(`• ${message.labels[field]}: ${row.value}`);
    }
    if (lines.length === 0) continue;
    blocks.push([`*${title}*`, ...lines].join('\n'));
    if (fields.includes('machine')) {
      const options = rows.filter(row => row.field === 'configuration');
      if (options.length)
        blocks.push(
          [
            `*${message.options}*`,
            ...options.map(row => `• ${row.label}: ${row.value}`)
          ].join('\n')
        );
    }
  }

  const notes = rows.find(row => row.field === 'notes');
  if (notes) blocks.push(`*${message.notes}*\n${notes.value}`);

  return blocks.join('\n\n');
}
