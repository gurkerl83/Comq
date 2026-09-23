import type { AriaAttributes } from 'react';

import { hasError } from '../../../../lib/forms/errors';
import type { FieldDetails } from '../types';

/**
 * Bind a control to the help and error messages rendered by FormField.
 *
 * 1. Preserve caller-supplied description IDs in order, without duplicates.
 * 2. Return generated IDs only for messages that FormField will render.
 * 3. An error forces aria-invalid=true; otherwise preserve the caller's value.
 *
 * Example sequence: a fresh, untouched quantity field changes from 1 -> 100 -> 2.
 * It has no help text, caller-supplied ARIA attributes or previous error.
 *
 * 1. At 1, there is no error. The helper returns no errorId or description,
 *    and aria-invalid defaults to false.
 * 2. The visitor enters 100. React Hook Form stores the value; onTouched waits
 *    for the first blur before validating this edit. An invalid answer alone
 *    does not disable Continue.
 * 3. On blur, the enquiry resolver rejects 100 as outside the 1-99 range.
 *    RequirementsStep reads the translated error through useFormState and
 *    passes it through TextField to FormField, which calls this helper again.
 * 4. The helper returns errorId="quantity-error", adds that same ID to
 *    aria-describedby, and sets aria-invalid=true.
 * 5. FormField renders the error span with that ID and role="alert". TextField
 *    applies the returned attributes to the input. Its description now points
 *    to the displayed message; FieldControl.module.css applies its invalid border.
 * 6. The visitor replaces 100 with 2. The touched field revalidates while editing,
 *    so the error clears without another blur. The helper removes its generated
 *    reference and restores false; FormField removes the span.
 *
 * Continue or Enter can also expose the error through
 * trigger(fields, { shouldTouch: true }). This validates and touches the relevant
 * fields without marking the enquiry submitted; corrections then revalidate.
 *
 * For fields with help text, the help ID and description remain when an error
 * clears. Caller-supplied description IDs remain too, and the caller's invalid
 * state is restored. This helper only derives the binding; validation decides
 * when errors appear.
 */
export function getFieldAccessibility({
  id,
  help,
  error,
  'aria-describedby': describedBy,
  'aria-invalid': invalid = false
}: Pick<FieldDetails, 'id' | 'help' | 'error'> &
  Pick<AriaAttributes, 'aria-describedby' | 'aria-invalid'>) {
  const descriptionIds = new Set<string>();

  if (describedBy) {
    for (const descriptionId of describedBy.split(/\s+/)) {
      if (descriptionId === '') continue;
      descriptionIds.add(descriptionId);
    }
  }

  let helpId: string | undefined;
  if (help) {
    helpId = `${id}-help`;
    descriptionIds.add(helpId);
  }

  let errorId: string | undefined;
  let ariaInvalid = invalid;
  if (hasError(error)) {
    errorId = `${id}-error`;
    descriptionIds.add(errorId);
    ariaInvalid = true;
  }

  let ariaDescribedBy: string | undefined;
  if (descriptionIds.size > 0) {
    ariaDescribedBy = [...descriptionIds].join(' ');
  }

  return {
    helpId,
    errorId,
    attributes: {
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid
    }
  };
}
