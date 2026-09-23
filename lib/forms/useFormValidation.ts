import { useCallback, useState, type FocusEvent, type FormEvent } from 'react';

import { hasError } from './errors';
import {
  getEventField,
  getFirstInvalidField,
  hasBadInput,
  remainsInField
} from './native-controls';
import type { FieldValidator } from './validation';

/**
 * One validation policy for native controls and structured answers.
 * Each field rule owns its value-shape checks; native parsing stays separate.
 *
 * 1. Fields stay quiet until blur or submission finds an error. A radio group
 *    is left only when focus moves outside its entire fieldset.
 * 2. Once a field has failed, derive its message from every subsequent value.
 *    Example: 999 -> 100 keeps the quantity error; 100 -> 2 removes it.
 *    No second error-value store can become stale or clear an invalid answer.
 * 3. Native badInput is tracked separately because an unfinished date/number
 *    can expose an empty value even though the visitor has started typing.
 * 4. Only active fields participate. Hidden rental answers remain in the draft
 *    without blocking purchase. reset() clears presentation, never answers.
 */
export function useFormValidation<FieldName extends string>(
  values: Record<FieldName, unknown>,
  rules: Record<FieldName, FieldValidator>,
  activeFields: readonly FieldName[]
) {
  const [revealedFields, setRevealedFields] = useState<Set<FieldName>>(
    () => new Set()
  );
  const [badInputs, setBadInputs] = useState<
    Partial<Record<FieldName, boolean>>
  >({});

  // Button availability checks every active field, including untouched ones.
  // Error messages still appear only after blur or a failed submission.
  // Example: an empty country disables Continue without showing an error yet.
  let isValid = true;
  const errors: Partial<Record<FieldName, string>> = {};
  for (const name of activeFields) {
    const message = rules[name](values[name], badInputs[name]);
    if (!hasError(message)) continue;

    isValid = false;
    if (!revealedFields.has(name)) continue;
    errors[name] = message;
  }

  /**
   * Keep a React snapshot of the browser's parsing validity.
   *
   * 1. Input and blur share this updater. An incomplete date can expose an
   *    empty value with badInput=true, unlike an intentionally empty date.
   * 2. Missing flags count as false. Reuse the previous state object when
   *    validity has not changed, avoiding an unnecessary state change.
   * 3. The functional update reads the latest map. The callback captures only
   *    React's stable state setter, so an empty dependency array is sufficient.
   */
  const updateBadInput = useCallback((name: FieldName, badInput: boolean) => {
    setBadInputs(previous => {
      const wasBadInput = previous[name] === true;
      if (wasBadInput === badInput) return previous;
      return { ...previous, [name]: badInput };
    });
  }, []);

  const handleInput = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      const name = getEventField(event.target, activeFields);
      if (!name) return;

      // The input event reads native parsing state immediately. Controlled
      // draft updates then render the rules against the new entered value.
      const badInput = hasBadInput(event.currentTarget, name);
      updateBadInput(name, badInput);
    },
    [activeFields, updateBadInput]
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLFormElement>) => {
      if (remainsInField(event.target, event.relatedTarget)) return;
      const name = getEventField(event.target, activeFields);
      if (!name) return;

      const badInput = hasBadInput(event.currentTarget, name);
      updateBadInput(name, badInput);

      if (!hasError(rules[name](values[name], badInput))) return;
      setRevealedFields(previous => {
        if (previous.has(name)) return previous;
        return new Set(previous).add(name);
      });
    },
    [activeFields, rules, values, updateBadInput]
  );

  const validate = useCallback(
    (form: HTMLFormElement) => {
      const invalidFields: FieldName[] = [];
      const currentBadInputs: Partial<Record<FieldName, boolean>> = {};

      for (const name of activeFields) {
        const badInput = hasBadInput(form, name);
        currentBadInputs[name] = badInput;
        if (hasError(rules[name](values[name], badInput)))
          invalidFields.push(name);
      }

      setBadInputs(previous => ({ ...previous, ...currentBadInputs }));
      setRevealedFields(previous => new Set([...previous, ...invalidFields]));
      return getFirstInvalidField(form, invalidFields);
    },
    [activeFields, rules, values]
  );

  // Unmounting a conditional field also discards the browser's partial edit.
  // Clear that parsing snapshot while preserving its completed draft value.
  const clearNativeValidity = useCallback((fields: readonly FieldName[]) => {
    setBadInputs(previous => {
      const next = { ...previous };
      for (const name of fields) delete next[name];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setRevealedFields(new Set());
    setBadInputs({});
  }, []);

  return {
    isValid,
    errors,
    handleInput,
    handleBlur,
    validate,
    clearNativeValidity,
    reset
  };
}
