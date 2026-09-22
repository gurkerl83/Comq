import type { EquipmentDefinition } from './types';
import { DEMO_EQUIPMENT_IMAGES } from './demo-images';

/**
 * Fictional Jumbo J1 definition shared by every language.
 */
const DEMO_JUMBO_J1: EquipmentDefinition = {
  category: 'jumbo',
  model: 'DEMO J1',
  specifications: [
    { id: 'booms', value: '1' },
    { id: 'power', value: '105 kW' },
    { id: 'width', value: '1.8 m' }
  ],
  // Fictional alternatives exercise customization; they are not COMQ offers.
  options: [
    {
      id: 'power',
      label: 'power',
      specificationId: 'power',
      defaultChoice: 'power-105',
      choices: [
        { id: 'power-105', label: '105 kW' },
        { id: 'power-120', label: '120 kW' }
      ]
    }
  ],
  extras: ['rear-camera', 'central-lubrication'],
  images: DEMO_EQUIPMENT_IMAGES,
  isDemo: true
};

/**
 * Fictional Jumbo J2 definition shared by every language.
 */
const DEMO_JUMBO_J2: EquipmentDefinition = {
  category: 'jumbo',
  model: 'DEMO J2',
  specifications: [
    { id: 'booms', value: '2' },
    { id: 'power', value: '145 kW' },
    { id: 'width', value: '2.4 m' }
  ],
  // This fictional chassis choice changes only the requested width.
  options: [
    {
      id: 'width',
      label: 'width',
      specificationId: 'width',
      defaultChoice: 'width-2400',
      choices: [
        { id: 'width-2400', label: '2.4 m' },
        { id: 'width-2200', label: '2.2 m' }
      ]
    }
  ],
  extras: [],
  images: DEMO_EQUIPMENT_IMAGES.slice(0, 3),
  isDemo: true
};

/**
 * Fictional Scooptram S1 definition shared by every language.
 */
const DEMO_SCOOPTRAM_S1: EquipmentDefinition = {
  category: 'scooptram',
  model: 'DEMO S1',
  specifications: [
    { id: 'payload', value: '3 t' },
    { id: 'power', value: '90 kW' },
    { id: 'width', value: '1.6 m' }
  ],
  options: [],
  extras: [],
  images: DEMO_EQUIPMENT_IMAGES.slice(0, 4),
  isDemo: true
};

/**
 * Fictional Drill D1 definition shared by every language.
 */
const DEMO_DRILL_D1: EquipmentDefinition = {
  category: 'drill',
  model: 'DEMO D1',
  specifications: [
    { id: 'diameter', value: '76 mm' },
    { id: 'power', value: '75 kW' },
    { id: 'width', value: '1.5 m' }
  ],
  options: [],
  extras: [],
  images: DEMO_EQUIPMENT_IMAGES.slice(0, 2),
  isDemo: true
};

/**
 * Fictional machine records keyed by their language-independent route slug.
 *
 * Add confirmed records with isDemo: false. Each key identifies the machine
 * in routes and translations; its facts do not repeat the slug.
 */
export const EQUIPMENT = {
  'demo-jumbo-j1': DEMO_JUMBO_J1,
  'demo-jumbo-j2': DEMO_JUMBO_J2,
  'demo-scooptram-s1': DEMO_SCOOPTRAM_S1,
  'demo-drill-d1': DEMO_DRILL_D1
};

/**
 * Machine identifiers derived from the authored catalogue keys.
 */
export type MachineSlug = keyof typeof EQUIPMENT;

/**
 * Static route identifiers derived without loading a language dictionary.
 *
 * Object.keys returns string[]. These keys come directly from the authored
 * EQUIPMENT object, so this local assertion preserves their MachineSlug type.
 */
export const EQUIPMENT_SLUGS = Object.keys(EQUIPMENT) as MachineSlug[];
