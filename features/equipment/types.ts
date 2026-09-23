import type { GalleryImage } from '../../components/gallery';

/**
 * Equipment groups shared by machine records and translated category text.
 */
export type EquipmentCategoryId = 'jumbo' | 'scooptram' | 'drill';

/**
 * Specification keys shared by machine facts and translated labels.
 *
 * 1. booms: number of drilling booms.
 * 2. power: machine power.
 * 3. width: overall machine width.
 * 4. payload: material carrying capacity.
 * 5. diameter: drilling diameter.
 */
export type EquipmentSpecificationId =
  'booms' | 'power' | 'width' | 'payload' | 'diameter';

/**
 * Known optional-equipment IDs across the catalogue.
 *
 * Each machine lists only the extras it supports; that list may be empty.
 * Every known ID requires a translated label in each dictionary.
 */
export type EquipmentExtraId = 'rear-camera' | 'central-lubrication';

/**
 * Alternative-text keys used by the shared machine illustrations.
 *
 * 1. machineSide: side view of the machine.
 * 2. machineFront: front view of the machine.
 * 3. hydraulicBoom: detail of the hydraulic boom.
 * 4. operatorCab: operator cab and controls.
 * 5. wheelDetail: detail of a machine wheel.
 * 6. machineRear: rear view of the machine.
 */
export type EquipmentImageKey =
  | 'machineSide'
  | 'machineFront'
  | 'hydraulicBoom'
  | 'operatorCab'
  | 'wheelDetail'
  | 'machineRear';

/**
 * A supported value for one configurable aspect of a machine.
 */
export type EquipmentChoice = {
  /**
   * Stable value stored in the enquiry, independent of language.
   */
  id: string;
  /**
   * Localized value, including its unit where relevant.
   */
  label: string;
};

/**
 * Mutually exclusive alternatives authored for a particular machine.
 */
export type EquipmentOption = {
  /**
   * Stable aspect ID used to associate the visitor's answer.
   */
  id: string;
  /**
   * Localized aspect name shown in the card and enquiry.
   */
  label: string;
  /**
   * Specification this option replaces in the selected card, if any.
   */
  specificationId?: string;
  /**
   * ID of the documented starting choice; must belong to choices.
   */
  defaultChoice: string;
  /**
   * Supported alternatives, in display order.
   */
  choices: EquipmentChoice[];
};

/**
 * An independent extra that can be requested alongside other extras.
 */
export type EquipmentExtra = {
  /**
   * Stable ID stored in the enquiry.
   */
  id: string;
  /**
   * Localized equipment name.
   */
  label: string;
};

/**
 * Applied or temporarily edited equipment choices, separate from project needs.
 */
export type EquipmentConfiguration = {
  /**
   * Choice IDs by aspect; null explicitly requests advice for that aspect.
   */
  choices: Record<string, string | null>;
  /**
   * Requested extra IDs; an empty list deliberately requests no extras.
   */
  extras: string[];
};

/**
 * A machine assembled with localized text for browsing and the enquiry wizard.
 */
export type EquipmentEntry = {
  /**
   * Stable route identifier for the machine.
   */
  slug: string;
  /**
   * Equipment group used to filter the catalogue.
   */
  category: EquipmentCategoryId;
  /**
   * Localized name of the equipment group.
   */
  categoryName: string;
  /**
   * Localized introduction to the equipment group.
   */
  categoryDescription: string;
  /**
   * Localized machine name used in cards, headings and enquiries.
   */
  name: string;
  /**
   * Localized description used for comparison and metadata.
   */
  summary: string;
  /**
   * Localized description of the machine's intended use.
   */
  application: string;
  /**
   * Published model reference, or null when unconfirmed.
   */
  model: string | null;
  /**
   * Baseline machine facts with localized labels, in display order.
   */
  specifications: Array<{
    /**
     * Stable identifier used to associate configurable options with this fact.
     */
    id: string;
    /**
     * Localized specification name.
     */
    label: string;
    /**
     * Published value including its unit, or null when unconfirmed.
     */
    value: string | null;
  }>;
  /**
   * Machine-specific alternatives; empty for a fixed specification.
   */
  options: EquipmentOption[];
  /**
   * Independent equipment extras supported by this machine.
   */
  extras: EquipmentExtra[];
  /**
   * Product photographs with localized descriptions, in display order.
   */
  images: GalleryImage[];
  /**
   * Identifies fictional records for demo notices and indexing rules.
   */
  isDemo: boolean;
};

/**
 * An equipment group with the localized text needed to browse its machines.
 */
export type EquipmentCategory = {
  /**
   * Stable equipment-group identifier.
   */
  id: EquipmentCategoryId;
  /**
   * Localized group name.
   */
  name: EquipmentEntry['categoryName'];
  /**
   * Localized introduction to the group.
   */
  description: EquipmentEntry['categoryDescription'];
};

/**
 * Image metadata with a dictionary key for its alternative text.
 */
export type EquipmentImageDefinition = Omit<GalleryImage, 'alt'> & {
  /**
   * Description key resolved when assembling the localized catalogue.
   */
  alt: EquipmentImageKey;
};

/**
 * Language-independent machine facts and references to translated labels.
 */
export type EquipmentDefinition = {
  /**
   * Equipment group used for browsing and selection.
   */
  category: EquipmentCategoryId;
  /**
   * Published model reference, when available.
   */
  model: EquipmentEntry['model'];
  /**
   * Baseline values with IDs that identify their translated labels.
   */
  specifications: Array<{
    /**
     * Stable specification ID and dictionary label key.
     */
    id: EquipmentSpecificationId;
    /**
     * Published value including its unit, or null when unconfirmed.
     */
    value: string | null;
  }>;
  /**
   * Supported alternatives and defaults; current numeric choices are language-neutral.
   */
  options: Array<
    Omit<EquipmentOption, 'label'> & {
      /**
       * Specification label reused for this configurable aspect.
       */
      label: EquipmentSpecificationId;
    }
  >;
  /**
   * IDs of independent extras offered for this machine.
   */
  extras: Array<EquipmentExtraId>;
  /**
   * Image paths, dimensions and description keys in display order.
   */
  images: EquipmentImageDefinition[];
  /**
   * Identifies fictional records for demo notices and indexing rules.
   */
  isDemo: boolean;
};
