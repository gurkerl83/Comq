function isDefined<Value>(value: Value | undefined): value is Value {
  return value !== undefined;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value !== '';
}

/**
 * An error is present only when it has a message. Accept null from validators
 * and undefined from optional props; preserve whitespace rather than trimming.
 */
export function hasError(error: string | null | undefined): error is string {
  return isDefined(error) && isNonEmptyString(error);
}
