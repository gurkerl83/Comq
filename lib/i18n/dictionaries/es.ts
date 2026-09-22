import type { Dictionary } from '../types';

const dictionary: Dictionary = {
  theme: {
    switchToLight: 'Cambiar al tema claro',
    switchToDark: 'Cambiar al tema oscuro'
  },
  navigation: {
    home: 'Inicio',
    language: 'Idioma',
    whatsapp: 'Cotizar',
    whatsappLabel: 'Cotizar por WhatsApp',
    skipToContent: 'Saltar al contenido'
  },
  home: {
    slogan: 'Soluciones Integrales en Minería Subterránea',
    description:
      'Venta y alquiler de equipos y suministro de repuestos para la minería subterránea en Perú.'
  },
  company: {
    title: 'Empresa',
    heading: 'Acerca de COMQ',
    description:
      'COMQ aplica la experiencia práctica en minería a la venta y alquiler de equipos y al suministro de repuestos para operaciones subterráneas.',
    purpose: {
      heading: 'La idea detrás de COMQ',
      description:
        'Nuestro propósito es ayudar a cada cliente a elegir soluciones adecuadas para su operación subterránea, con asesoría clara y contacto directo. Combinamos el conocimiento de los equipos mineros con la comprensión de las necesidades del día a día en mina para orientar esas decisiones.'
    },
    customers: {
      heading: 'Centrados en cada operación',
      description:
        'Cada operación tiene sus propios requerimientos. Ya sea para adquirir un equipo, alquilarlo o conseguir repuestos, nuestro punto de partida es comprender el uso previsto y lo que el cliente necesita para seguir trabajando.'
    },
    approach: {
      heading: 'Cómo trabajamos',
      description:
        'Creemos que una buena asesoría empieza por escuchar. Nuestro enfoque combina conocimiento práctico de los equipos, comunicación clara y una relación directa con el cliente, desde la primera consulta hasta la evaluación de una solución adecuada.'
    }
  },
  experience: {
    catchphrase: 'Más de 35 años de experiencia en minería.',
    heading: 'La experiencia detrás de COMQ',
    highlightHeading: 'Experiencia minera aplicada a tu operación.',
    yearsLabel: 'años en minería',
    founderRole: 'Fundador · Experto y asesor en minería',
    biography:
      'Alberto Llana, experto y asesor en minería, aporta a COMQ más de 35 años de experiencia en equipos mineros, gestión de servicios y desarrollo comercial, adquirida en Sandvik, Normet y RESEMIN.',
    profileLink: 'Conoce la trayectoria de Alberto'
  },
  services: {
    imagePlaceholder: 'Imagen pendiente',
    salesTitle: 'Venta de Equipos',
    salesDescription:
      'Jumbos, Scoops y Perforadoras nuevas. Entrega inmediata a nivel mundial.',
    rentalsTitle: 'Alquiler de Equipos',
    rentalsDescription:
      'Flota propia. Mantenimiento incluido. Respuesta 24/7 en mina.',
    partsTitle: 'Repuestos',
    partsDescription:
      'Originales y alternativos para todas las marcas. Stock permanente.'
  },
  servicePages: {
    quoteHeading: 'Cuéntanos qué necesita tu operación.',
    pages: {
      sales: {
        title: 'Venta de equipos para minería subterránea',
        introduction:
          'Jumbos, scoops y perforadoras, con asesoría adaptada a tu operación.',
        options: {
          heading: 'Equipos y aplicaciones',
          items: [
            'Tipos de equipos y aplicaciones previstas',
            'Modelos, fotografías y especificaciones técnicas',
            'Disponibilidad y estado de los equipos'
          ]
        },
        details: {
          heading: 'Detalles de entrega y compra',
          items: [
            'Modalidades y plazos de entrega para tu destino',
            'Consultas sobre documentación, pago y garantía',
            'Requerimientos que aclarar antes de la compra'
          ]
        },
        quoteRequirements: [
          'Tipo de equipo',
          'Especificaciones requeridas',
          'Cantidad',
          'Destino'
        ]
      },
      rentals: {
        title: 'Alquiler de equipos para minería subterránea',
        introduction:
          'Conversemos sobre los equipos que necesita tu mina, el plazo y los requerimientos de operación.',
        options: {
          heading: 'Flota y opciones de alquiler',
          items: [
            'Tipos de equipos y unidades a evaluar',
            'Especificaciones e idoneidad para el trabajo',
            'Duración del alquiler y disponibilidad de equipos'
          ]
        },
        details: {
          heading: 'Cobertura, mantenimiento y condiciones de alquiler',
          items: [
            'Ubicación de la mina y traslado de los equipos',
            'Alcance del mantenimiento y responsabilidades del cliente',
            'Necesidades de operadores, consumibles y condiciones de alquiler'
          ]
        },
        quoteRequirements: [
          'Equipo requerido',
          'Ubicación de la mina',
          'Fecha de inicio',
          'Duración del alquiler'
        ]
      },
      parts: {
        title: 'Repuestos para equipos de minería subterránea',
        introduction:
          'Conversemos sobre repuestos originales y alternativos para tus equipos y su aplicación.',
        options: {
          heading: 'Repuestos y compatibilidad con tus equipos',
          items: [
            'Marcas, modelos de equipos y tipos de repuestos',
            'Números de parte, números de serie y compatibilidad',
            'Cantidades requeridas y consulta de disponibilidad'
          ]
        },
        details: {
          heading: 'Detalles de suministro, entrega y calidad',
          items: [
            'Plazos y modalidades de entrega para tu destino',
            'Opciones originales y alternativas para comparar',
            'Consultas sobre garantía y devoluciones'
          ]
        },
        quoteRequirements: [
          'Modelo del equipo',
          'Número de parte o fotografía',
          'Cantidad',
          'Destino'
        ]
      }
    }
  },
  equipment: {
    categories: {
      jumbo: {
        name: 'Jumbos',
        description: 'Explora ejemplos de equipos de perforación subterránea.'
      },
      scooptram: {
        name: 'Scooptrams',
        description: 'Explora ejemplos de equipos de carga y transporte.'
      },
      drill: {
        name: 'Perforadoras',
        description: 'Explora ejemplos de equipos para tareas de perforación.'
      }
    },
    machines: {
      'demo-jumbo-j1': {
        name: 'Jumbo Demo J1',
        summary: 'Jumbo ficticio de un brazo para perforación subterránea.',
        application:
          'Ejemplo de una operación de perforación subterránea. Describe tu proyecto al preparar la consulta.'
      },
      'demo-jumbo-j2': {
        name: 'Jumbo Demo J2',
        summary: 'Jumbo ficticio de dos brazos para perforación subterránea.',
        application:
          'Ejemplo de una operación de perforación con dos brazos. Las cifras solo ilustran las opciones del selector.'
      },
      'demo-scooptram-s1': {
        name: 'Scooptram Demo S1',
        summary: 'Scooptram ficticio para carga y transporte de material.',
        application:
          'Ejemplo de tareas de carga y transporte de material. La capacidad indicada es un dato de demostración.'
      },
      'demo-drill-d1': {
        name: 'Perforadora Demo D1',
        summary: 'Equipo ficticio para tareas de perforación.',
        application:
          'Ejemplo de un proyecto de perforación. El método y las condiciones de trabajo se describen en la consulta.'
      }
    },
    specifications: {
      booms: 'Brazos',
      power: 'Potencia',
      width: 'Ancho',
      payload: 'Capacidad de carga',
      diameter: 'Diámetro de perforación'
    },
    extras: {
      'rear-camera': 'Cámara de visión trasera',
      'central-lubrication': 'Lubricación centralizada'
    },
    images: {
      machineSide:
        'Ilustración de demostración 01: vista lateral de un equipo minero ficticio.',
      machineFront:
        'Ilustración de demostración 02: vista frontal de un equipo minero ficticio.',
      hydraulicBoom:
        'Ilustración de demostración 03: detalle de un brazo hidráulico ficticio.',
      operatorCab:
        'Ilustración de demostración 04: cabina y controles de un equipo ficticio.',
      wheelDetail:
        'Ilustración de demostración 05: detalle de una rueda de un equipo ficticio.',
      machineRear:
        'Ilustración de demostración 06: vista posterior de un equipo minero ficticio.'
    }
  },
  quote: {
    invitation: 'Hablemos de tus necesidades de equipos mineros.'
  },
  footer: {
    about: 'Acerca de COMQ',
    expertise: 'Nuestra experiencia',
    contact: 'Contacto',
    location: 'Lima, Perú',
    phone: 'Teléfono',
    email: 'Correo'
  }
};

export default dictionary;
