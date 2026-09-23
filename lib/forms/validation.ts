/**
 * A synchronous field rule returns its translated error, or null when valid.
 */
export type FieldValidator = (
  value: unknown,
  badInput?: boolean
) => string | null;

/**
 * Keep numeric drafts unchanged, including out-of-range values such as 100.
 */
export function validateInteger(
  value: unknown,
  bounds: { min: number; max: number },
  message: string
) {
  // Check every character before parsing: parseInt alone would accept '12x'.
  if (typeof value !== 'string' || value === '' || /\D/.test(value))
    return message;
  const integer = parseInt(value, 10);
  if (integer < bounds.min || integer > bounds.max) return message;
  return null;
}

export function validateOptionalText(
  value: unknown,
  maxLength: number,
  message: string
) {
  if (typeof value !== 'string' || value.length > maxLength) return message;
  return null;
}

/**
 * Validate an optional YYYY-MM-DD answer in the visitor's local timezone.
 *
 * 1. Check the fixed-width numeric format before parsing its named parts.
 * 2. Compare the parsed date with those parts: Date can normalize February 30
 *    into March, which must not turn an impossible date into a valid answer.
 * 3. Compare with local midnight today, evaluated when validation runs.
 */
export function validateOptionalFutureDate(value: unknown, message: string) {
  if (value === '') return null;
  if (typeof value !== 'string') return message;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return message;

  const [year, month, day] = value.split('-').map(part => parseInt(part, 10));
  const selected = new Date(`${value}T00:00:00`);
  if (
    year < 1 ||
    Number.isNaN(selected.getTime()) ||
    selected.getFullYear() !== year ||
    selected.getMonth() + 1 !== month ||
    selected.getDate() !== day
  ) {
    return message;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selected < today) return message;
  return null;
}
