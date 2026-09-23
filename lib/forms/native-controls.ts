type NativeFormControl =
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function isFormControl(target: unknown): target is NativeFormControl {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLTextAreaElement
  );
}

/**
 * Resolve only field names registered by the current step. A radio group's
 * wrapper also identifies blur events originating from its machine-detail link.
 */
export function getEventField<FieldName extends string>(
  target: EventTarget | null,
  activeFields: readonly FieldName[]
) {
  if (!(target instanceof Element)) return;

  const group = target.closest<HTMLElement>('[data-validation-field]');
  let name = group?.dataset.validationField;
  if (isFormControl(target)) name = target.name;

  return activeFields.find(field => field === name);
}

/**
 * Moving between options, or to a detail link within the fieldset, does not
 * leave a radio group. Tabbing out of that fieldset does.
 */
export function remainsInField(
  target: EventTarget | null,
  relatedTarget: EventTarget | null
) {
  if (!(target instanceof Element) || !(relatedTarget instanceof Node))
    return false;

  const field = target.closest('[data-validation-field]');
  if (!field) return false;
  return field.contains(relatedTarget);
}

function getFieldControls(form: HTMLFormElement, name: string) {
  return Array.from(form.elements).filter(
    (element): element is NativeFormControl =>
      isFormControl(element) &&
      element.name === name &&
      !element.matches(':disabled')
  );
}

/**
 * A partially entered native number/date can have an empty string value while
 * the browser reports badInput. Preserve that distinction from an empty field.
 */
export function hasBadInput(form: HTMLFormElement, name: string) {
  return getFieldControls(form, name).some(
    control => control.validity.badInput
  );
}

export function getFirstInvalidField<FieldName extends string>(
  form: HTMLFormElement,
  invalidFields: readonly FieldName[]
) {
  for (const element of Array.from(form.elements)) {
    if (!isFormControl(element) || element.matches(':disabled')) continue;
    const field = invalidFields.find(name => name === element.name);
    if (field) return field;
  }

  const [firstInvalid] = invalidFields;
  return firstInvalid;
}

/**
 * Focus the invalid named control. For radios, use its checked option or the
 * first enabled option in that same group, never an unrelated radio group.
 */
export function focusFormField(form: HTMLFormElement, name: string) {
  const controls = getFieldControls(form, name);
  const checked = controls.find(
    control =>
      control instanceof HTMLInputElement &&
      control.type === 'radio' &&
      control.checked
  );

  if (checked) {
    checked.focus();
    return;
  }

  const [firstControl] = controls;
  firstControl?.focus();
}
