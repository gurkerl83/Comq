import type { SupportedLocale } from '../../lib/i18n/locales';
import type { EquipmentEntry } from './catalogue';
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
  variant: string;
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
    variant: '',
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
    machine: machine.slug
  };
}

/**
 * Choose the starting step once, when the wizard initializes its state.
 * createSelection has already resolved the URL's machine against the catalogue:
 * 1. A recognized machine supplies both equipment answers, so start at Requirements.
 * 2. Otherwise use the first step in the shared sequence to choose equipment.
 *
 * Example: ?machine=demo-jumbo-j1 opens Requirements; an unknown slug starts
 * at Category. Later equipment changes leave navigation to the wizard.
 */
export function getInitialSelectionStep(
  selection: EquipmentSelection
): SelectionStep {
  if (selection.machine) return SelectionStep.Requirements;
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
  return { ...selection, category, machine, variant: '' };
}

/**
 * Choose another machine within the active category, preserving enquiry answers.
 * 1. Keep the existing draft for the same machine, an unknown slug or a machine
 *    from another category.
 * 2. For an accepted change, return a new draft with the chosen machine and an
 *    empty configuration. Configurations belong to individual catalogue entries.
 *
 * Example: J1 to J2 keeps Rental, quantity and project details, and resets the
 * configuration to Advice requested. The wizard still owns step navigation.
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
  return { ...selection, machine: entry.slug, variant: '' };
}

type SelectionInputField = Exclude<
  keyof EquipmentSelection,
  'category' | 'machine'
>;

export type UpdateSelectionField<
  Fields extends SelectionInputField = SelectionInputField
> = <Key extends Fields>(key: Key, value: EquipmentSelection[Key]) => void;

export type SelectionErrors = Partial<Record<keyof EquipmentSelection, string>>;

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
 * Build the active rows once so Review and WhatsApp share formatted values.
 */
export function getSelectionSummary(
  locale: SupportedLocale,
  selection: EquipmentSelection,
  machine: EquipmentEntry,
  translations: SelectorContent
) {
  const variant = machine.variants.find(
    option => option.id === selection.variant
  );
  const country = translations.countries.find(
    option => option.code === selection.country
  );
  let countryName = translations.notSpecified;
  if (country) countryName = country.name;

  const rows: Array<{
    field: keyof EquipmentSelection;
    label: string;
    value: string;
    step: SelectionStep;
  }> = [
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
    {
      field: 'variant',
      label: translations.configuration,
      value: variant?.label ?? translations.advice,
      step: SelectionStep.Requirements
    },
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
      fields: ['category', 'machine', 'variant']
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
  }

  const notes = rows.find(row => row.field === 'notes');
  if (notes) blocks.push(`*${message.notes}*\n${notes.value}`);

  return blocks.join('\n\n');
}
