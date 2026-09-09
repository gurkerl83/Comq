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
    companies: string;
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
  footer: {
    contactLinks: string;
    location: string;
    phone: string;
    email: string;
  };
}
