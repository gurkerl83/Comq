import type { MachineSlug } from '../../features/equipment/catalogue-data';
import type {
  EquipmentCategoryId,
  EquipmentExtraId,
  EquipmentImageKey,
  EquipmentSpecificationId
} from '../../features/equipment/types';

export type ServiceKey = 'sales' | 'rentals' | 'parts';

/** Shared content shape for the three authored service pages in each locale. */
export interface ServicePageContent {
  title: string;
  introduction: string;
  options: {
    heading: string;
    items: string[];
  };
  details: {
    heading: string;
    items: string[];
  };
  quoteRequirements: string[];
}

/**
 * Localized descriptions for one machine.
 */
type MachineText = {
  /**
   * Machine name shown in cards, headings and enquiries.
   */
  name: string;
  /**
   * Short description used in comparisons and page metadata.
   */
  summary: string;
  /**
   * Intended-use description for the product page.
   */
  application: string;
};

/**
 * Catalogue text for one language, keyed by equipment-owned identifiers.
 *
 * Every dictionary must describe every authored machine. Machine facts and
 * route identifiers remain in the shared catalogue data.
 */
export type EquipmentContent = {
  /**
   * Category names and introductions used when browsing and selecting equipment.
   */
  categories: Record<
    EquipmentCategoryId,
    {
      /**
       * Display name for the equipment group.
       */
      name: string;
      /**
       * Brief introduction to the group's machines.
       */
      description: string;
    }
  >;
  /**
   * Product descriptions keyed by the machine's language-independent slug.
   */
  machines: Record<MachineSlug, MachineText>;
  /**
   * Shared labels for specification rows and their configurable alternatives.
   */
  specifications: Record<EquipmentSpecificationId, string>;
  /**
   * Labels for independently selectable equipment extras.
   */
  extras: Record<EquipmentExtraId, string>;
  /**
   * Alternative text for the shared demonstration illustrations.
   */
  images: Record<EquipmentImageKey, string>;
};

export interface Dictionary {
  theme: {
    switchToLight: string;
    switchToDark: string;
  };
  navigation: {
    home: string;
    language: string;
    whatsapp: string;
    whatsappLabel: string;
    skipToContent: string;
  };
  home: {
    slogan: string;
    description: string;
  };
  company: {
    title: string;
    heading: string;
    description: string;
    purpose: {
      heading: string;
      description: string;
    };
    customers: {
      heading: string;
      description: string;
    };
    approach: {
      heading: string;
      description: string;
    };
  };
  experience: {
    catchphrase: string;
    heading: string;
    highlightHeading: string;
    yearsLabel: string;
    founderRole: string;
    biography: string;
    profileLink: string;
  };
  services: {
    imagePlaceholder: string;
    salesTitle: string;
    salesDescription: string;
    rentalsTitle: string;
    rentalsDescription: string;
    partsTitle: string;
    partsDescription: string;
  };
  servicePages: {
    quoteHeading: string;
    pages: Record<ServiceKey, ServicePageContent>;
  };
  /** Localized catalogue descriptions, labels and image alternatives. */
  equipment: EquipmentContent;
  quote: {
    invitation: string;
  };
  footer: {
    about: string;
    expertise: string;
    contact: string;
    location: string;
    phone: string;
    email: string;
  };
}
