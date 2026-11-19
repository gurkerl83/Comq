import { useState } from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';

import type { EquipmentConfiguration } from '../types';
import type { EquipmentSelection } from '../selection';
import type { MachineCustomization } from './types';

/**
 * Whether the option editor is open on the chosen machine card, and the
 * actions that open, apply and close it.
 *
 * 1. Customize opens the editor. Its temporary choices live in the editor's
 *    own form, not here.
 * 2. Apply writes the complete configuration to the enquiry and closes the
 *    editor; Cancel closes it and the temporary choices are dropped.
 * 3. closeEditor is for the caller, because a step change or an equipment
 *    change (category or machine) closes the editor too.
 *
 * Flow between the editor's draft form and the enquiry form:
 * - Seed: the draft starts from customization.value, the applied
 *   configuration (defaultValues in MachineConfiguration.tsx).
 * - Rejoin: applyToEnquiry writes the draft into the enquiry form's
 *   configuration. Nothing reaches the enquiry form before that.
 *
 * @param form - The enquiry form whose configuration the editor changes.
 * @returns The customization the machine card receives, and closeEditor.
 */
export function useMachineCustomization(
  form: UseFormReturn<EquipmentSelection>
) {
  const [editing, setEditing] = useState(false);
  const configuration = useWatch({
    control: form.control,
    name: 'configuration'
  });

  /** Open the editor; its draft starts from the applied configuration. */
  function openEditor() {
    setEditing(true);
  }

  /**
   * The rejoin: write the editor's validated draft into the enquiry form,
   * then close the editor.
   *
   * 1. The editor calls this through draftForm.handleSubmit(customization.onApply).
   * 2. setValue replaces the complete configuration (choices and extras);
   *    the enquiry's other answers and initial defaults remain unchanged.
   * 3. Dirty state compares with initial defaults; touched records Apply, and
   *    validation refreshes configuration errors.
   * 4. Closing the editor discards its separate RHF instance. The enquiry
   *    is not submitted.
   *
   * @param value - Complete choices and extras accepted by the editor.
   */
  function applyToEnquiry(value: EquipmentConfiguration) {
    form.setValue('configuration', value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
    closeEditor();
  }

  /** Close the option editor; choices it has not applied are dropped. */
  function closeEditor() {
    setEditing(false);
  }

  const customization: MachineCustomization = {
    value: configuration,
    editing,
    onStart: openEditor,
    onApply: applyToEnquiry,
    onCancel: closeEditor
  };

  return { customization, closeEditor };
}
