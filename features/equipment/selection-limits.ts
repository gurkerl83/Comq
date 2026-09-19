/**
 * Shared numeric bounds and text lengths for validation and translations.
 */
export const SELECTION_LIMITS = {
  quantity: { min: 1, max: 99 },
  rentalDuration: { min: 1, max: 120 },
  projectLocation: { maxLength: 160 },
  notes: { maxLength: 1200 }
} as const;
