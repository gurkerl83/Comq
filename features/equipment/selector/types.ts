import type { SupportedLocale } from '../../../lib/i18n/locales';
import type { EquipmentEntry, EquipmentConfiguration } from '../types';
import type { SelectorContent } from '../selector-content';

/** Applied values and the explicit editing session for the selected machine. */
export type MachineCustomization = {
  /** Values already included in the enquiry. */
  value: EquipmentConfiguration;
  /** Temporary values while customizing; null means read-only mode. */
  draft: EquipmentConfiguration | null;
  /**
   * Begin editing the currently applied configuration.
   */
  onStart: () => void;
  /**
   * Replace the draft without changing the applied configuration.
   * Create new objects or arrays for changed values; do not mutate existing ones.
   */
  onChange: (draft: EquipmentConfiguration) => void;
  /** Validate and apply the temporary values, then leave edit mode. */
  onApply: () => void;
  /** Discard temporary edits. */
  onCancel: () => void;
};

/** Data shared by server preparation and the interactive wizard. */
export type SelectorProps = {
  /** Locale for machine links and summary formatting. */
  locale: SupportedLocale;
  /** Entries used to resolve preselection and populate equipment choices. */
  catalogue: EquipmentEntry[];
  /** UI copy, country options, validation messages, and enquiry text. */
  translations: SelectorContent;
};

/** URL input used to prepare the initial selection. */
export type SelectorQuery = {
  /** Requested machine slug; repeated parameters use the first value. */
  machine?: string | string[];
};

/**
 * A controlled choice reports the same value type that it receives.
 */
export type ChoiceProps<TValue> = {
  /** Parent-owned answer used to determine the checked option. */
  value: TValue;
  /** Feedback shown below the group and used to mark its options invalid. */
  error?: string;
  /** Reports a chosen answer for the parent to apply. */
  onChange: (value: TValue) => void;
  /** Legends, labels, and supporting text for the consuming choice component. */
  translations: SelectorContent;
};

/** Label and feedback metadata linked to a native form control. */
export type FieldDetails = {
  /** Connects the label to the control and prefixes generated message IDs. */
  id: string;
  /** Visible text identifying the control. */
  label: string;
  /**
   * Localized label hint; the native required attribute controls validity.
   */
  requirementLabel?: string;
  /** Supporting instructions included in the accessible description. */
  help?: string;
  /** Nonempty feedback is announced as an alert and marks the control invalid. */
  error?: string;
};

/**
 * Keep native props while each component owns its CSS class.
 */
export type WithoutClassName<Props> = Omit<Props, 'className'>;

/**
 * Props shared by labeled inputs, selects and textareas.
 *
 * Preserve native attributes and event types, including ARIA. FieldDetails
 * adds the required id and label, plus optional help and errors. Each
 * component owns its styling through WithoutClassName.
 */
export type NativeFieldProps<Props> = WithoutClassName<Props> & FieldDetails;
