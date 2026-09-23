import type { SupportedLocale } from '../../../lib/i18n/locales';
import type { EquipmentEntry, EquipmentConfiguration } from '../types';
import type { SelectorContent } from '../selector-content';

/**
 * Applied configuration and the lifecycle of its temporary editor.
 */
export type MachineCustomization = {
  /** Values already included in the enquiry. */
  value: EquipmentConfiguration;
  /** Whether the separate configuration form is mounted. */
  editing: boolean;
  /** Begin an editing session seeded from the applied values. */
  onStart: () => void;
  /** Replace the applied values after the editor validates them. */
  onApply: (value: EquipmentConfiguration) => void;
  /** Unmount the editor and discard its temporary values. */
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

/** Label and feedback metadata linked to a native form control. */
export type FieldDetails = {
  /** Connects the label to the control and prefixes generated message IDs. */
  id: string;
  /** Visible text identifying the control. */
  label: string;
  /**
   * Localized required/optional hint displayed alongside the label.
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
 * component owns its styling through WithoutClassName. Registration handlers
 * and refs reach the native control; these components do not own form state.
 */
export type NativeFieldProps<Props> = WithoutClassName<Props> & FieldDetails;
