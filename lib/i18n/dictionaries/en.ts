import type { Dictionary } from '../types';

const dictionary: Dictionary = {
  theme: {
    switchToLight: 'Switch to light theme',
    switchToDark: 'Switch to dark theme'
  },
  navigation: {
    home: 'Home',
    language: 'Language',
    whatsapp: 'Get a quote',
    whatsappLabel: 'Get a quote on WhatsApp',
    skipToContent: 'Skip to content'
  },
  home: {
    slogan: 'Comprehensive Solutions for Underground Mining',
    description:
      'Equipment sales, rentals and spare parts for underground mining in Peru.'
  },
  company: {
    title: 'Company',
    heading: 'About COMQ',
    description:
      'COMQ brings practical mining experience to equipment sales, rental and spare-parts supply for underground operations.',
    purpose: {
      heading: 'The idea behind COMQ',
      description:
        'Our aim is to help customers choose solutions suited to their underground operations, with clear advice and direct contact. We bring together knowledge of mining equipment and an understanding of the day-to-day needs of a mine to support those decisions.'
    },
    customers: {
      heading: 'Focused on each operation',
      description:
        'Every operation has its own requirements. Whether the need is to purchase equipment, arrange a rental or source spare parts, our starting point is to understand the intended use and what the customer needs to keep working.'
    },
    approach: {
      heading: 'How we work',
      description:
        'We believe useful advice starts with listening. Our approach combines practical equipment knowledge, clear communication and a direct relationship with the customer, from the initial enquiry to discussing a suitable solution.'
    }
  },
  experience: {
    catchphrase: 'Over 35 years of experience in mining.',
    heading: 'The experience behind COMQ',
    highlightHeading: 'Mining experience, applied to your operation.',
    yearsLabel: 'years in mining',
    founderRole: 'Founder · Mining expert and advisor',
    biography:
      'Alberto Llana, mining expert and advisor, brings COMQ over 35 years of experience in mining equipment, service management and business development gained at Sandvik, Normet and RESEMIN.',
    profileLink: 'Explore Alberto’s professional background'
  },
  services: {
    imagePlaceholder: 'Image placeholder',
    salesTitle: 'Equipment Sales',
    salesDescription:
      'New jumbos, scooptrams and drilling rigs. Immediate delivery worldwide.',
    rentalsTitle: 'Equipment Rentals',
    rentalsDescription:
      'Our own fleet. Maintenance included. Round-the-clock response at your mine.',
    partsTitle: 'Spare Parts',
    partsDescription:
      'Original and aftermarket parts for all brands. Always in stock.'
  },
  servicePages: {
    quoteHeading: 'Tell us what your operation needs.',
    pages: {
      sales: {
        title: 'Underground mining equipment for sale',
        introduction:
          'Jumbos, scooptrams and drilling rigs, with advice shaped around your operation.',
        options: {
          heading: 'Equipment and applications',
          items: [
            'Equipment categories and intended applications',
            'Models, photos and technical specifications',
            'Availability and equipment condition'
          ]
        },
        details: {
          heading: 'Delivery and purchase details',
          items: [
            'Delivery arrangements and lead times for your destination',
            'Documentation, payment and warranty questions',
            'Requirements to clarify before purchase'
          ]
        },
        quoteRequirements: [
          'Equipment type',
          'Required specification',
          'Quantity',
          'Destination'
        ]
      },
      rentals: {
        title: 'Equipment rental for underground mining',
        introduction:
          'Discuss the equipment your mine needs, the duration and operating requirements.',
        options: {
          heading: 'Fleet and rental options',
          items: [
            'Equipment categories and units to consider',
            'Specifications and suitability for the work',
            'Rental duration and equipment availability'
          ]
        },
        details: {
          heading: 'Coverage, maintenance and rental terms',
          items: [
            'Mine location and mobilisation arrangements',
            'Maintenance scope and customer responsibilities',
            'Operator needs, consumables and rental terms'
          ]
        },
        quoteRequirements: [
          'Equipment requirement',
          'Mine location',
          'Start date',
          'Rental duration'
        ]
      },
      parts: {
        title: 'Spare parts for underground mining equipment',
        introduction:
          'Discuss original and aftermarket parts for your equipment and application.',
        options: {
          heading: 'Parts and equipment compatibility',
          items: [
            'Equipment brands, models and part categories',
            'Part numbers, serial numbers and compatibility',
            'Required quantities and availability checks'
          ]
        },
        details: {
          heading: 'Supply, delivery and quality details',
          items: [
            'Lead times and delivery arrangements for your destination',
            'Original and aftermarket options to compare',
            'Warranty and returns questions'
          ]
        },
        quoteRequirements: [
          'Equipment model',
          'Part number or photo',
          'Quantity',
          'Destination'
        ]
      }
    }
  },
  equipment: {
    categories: {
      jumbo: {
        name: 'Jumbos',
        description: 'Explore examples of underground drilling equipment.'
      },
      scooptram: {
        name: 'Scooptrams',
        description: 'Explore examples of loading and hauling equipment.'
      },
      drill: {
        name: 'Drilling rigs',
        description: 'Explore examples of equipment for drilling tasks.'
      }
    },
    machines: {
      'demo-jumbo-j1': {
        name: 'Demo Jumbo J1',
        summary: 'Fictional single-boom jumbo for underground drilling.',
        application:
          'An example underground drilling operation. Describe your project when preparing the enquiry.'
      },
      'demo-jumbo-j2': {
        name: 'Demo Jumbo J2',
        summary: 'Fictional two-boom jumbo for underground drilling.',
        application:
          'An example drilling operation with two booms. The figures only illustrate the selector options.'
      },
      'demo-scooptram-s1': {
        name: 'Demo Scooptram S1',
        summary: 'Fictional scooptram for loading and hauling material.',
        application:
          'An example of material loading and hauling tasks. The stated capacity is demonstration data.'
      },
      'demo-drill-d1': {
        name: 'Demo Drilling Rig D1',
        summary: 'Fictional drilling rig for drilling tasks.',
        application:
          'An example drilling project. Describe the method and working conditions in the enquiry.'
      }
    },
    specifications: {
      booms: 'Booms',
      power: 'Power',
      width: 'Width',
      payload: 'Payload',
      diameter: 'Drilling diameter'
    },
    extras: {
      'rear-camera': 'Rear-view camera',
      'central-lubrication': 'Central lubrication'
    },
    images: {
      machineSide:
        'Demo illustration 01: side view of a fictional mining machine.',
      machineFront:
        'Demo illustration 02: front view of a fictional mining machine.',
      hydraulicBoom:
        'Demo illustration 03: detail of a fictional hydraulic boom.',
      operatorCab:
        'Demo illustration 04: operator cab and controls of a fictional machine.',
      wheelDetail: 'Demo illustration 05: wheel detail of a fictional machine.',
      machineRear:
        'Demo illustration 06: rear view of a fictional mining machine.'
    }
  },
  quote: {
    invitation: 'Let’s discuss your mining equipment needs.'
  },
  footer: {
    about: 'About COMQ',
    expertise: 'Our experience',
    contact: 'Contact',
    location: 'Lima, Peru',
    phone: 'Phone',
    email: 'Email'
  }
};

export default dictionary;
