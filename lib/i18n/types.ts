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

export interface Dictionary {
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
