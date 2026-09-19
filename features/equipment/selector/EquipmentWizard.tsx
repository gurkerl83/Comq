'use client';

import { useEffect, useRef, type FormEvent } from 'react';

import { focusFormField } from '../../../lib/forms/native-controls';
import { WHATSAPP_URL } from '../../../lib/site/config';
import type { EquipmentSelection } from '../selection';
import { SelectionStep, SELECTION_STEP_ORDER } from '../selection-steps';
import { CategoryStep } from './steps/CategoryStep';
import { MachineStep } from './steps/MachineStep';
import { RequirementsStep } from './steps/RequirementsStep';
import { ReviewStep } from './steps/ReviewStep';
import type { SelectorProps } from './types';
import { useEquipmentSelection } from './useEquipmentSelection';
import { WizardActions, WizardActionLink } from './WizardActions';
import { WizardProgress } from './WizardProgress';
import styles from './EquipmentWizard.module.css';

/**
 * Client boundary for the interactive form and its step components.
 *
 * 1. On a direct visit, Next renders the initial wizard HTML on the server,
 *    then hydrates it in the browser using the same initialSelection. A valid
 *    machine link therefore starts at Requirements without a post-mount jump.
 * 2. Subsequent Next navigation supplies server-prepared props through the RSC
 *    payload. The key assigned by EquipmentSelector determines whether this
 *    wizard instance is reused or replaced with a new draft.
 * 3. Once interactive, field events and step buttons update the shared hook
 *    locally. The callbacks passed to steps are created inside this client
 *    boundary; they do not call the server or change the browser URL.
 * 4. This native form delegates field input and blur to one validation hook.
 *    Continue is disabled while the active step is invalid. Submission still
 *    rechecks the fields and focuses the first invalid control if needed;
 *    heading focus follows a successful step change. Draft values remain in
 *    the selection hook so unmounting a step does not discard answers.
 */
export function EquipmentWizard({
  locale,
  catalogue,
  translations,
  initialSelection
}: SelectorProps & { initialSelection: EquipmentSelection }) {
  const wizard = useEquipmentSelection(
    locale,
    catalogue,
    initialSelection,
    translations
  );
  const { selection, step, errors, machine } = wizard;
  const currentStep = translations.steps[step];
  const progressSteps = SELECTION_STEP_ORDER.map(id => ({
    id,
    shortTitle: translations.steps[id].shortTitle
  }));
  const wizardStart = useRef<HTMLDivElement>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);

  // Focus the new heading, but scroll from the wizard's start so the progress
  // bar and heading both remain visible. Its height may vary when labels wrap
  // or mobile hides the numbers. Leave initial page focus and scroll unchanged.
  useEffect(() => {
    if (previousStep.current !== step) {
      stepHeading.current?.focus({ preventScroll: true });
      wizardStart.current?.scrollIntoView({ block: 'start' });
      previousStep.current = step;
    }
  }, [step]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstInvalid = wizard.nextStep(event.currentTarget);
    if (!firstInvalid) return;
    focusFormField(event.currentTarget, firstInvalid);
  }

  if (!catalogue.length)
    return (
      <p>
        {translations.emptyCatalogue}{' '}
        <a href={WHATSAPP_URL}>{translations.contact}</a>
      </p>
    );

  return (
    <div ref={wizardStart} className={styles.wizard}>
      <WizardProgress
        steps={progressSteps}
        currentIndex={wizard.stepIndex}
        label={translations.progress}
      />
      <form
        onSubmit={handleSubmit}
        onInput={wizard.validation.handleInput}
        onBlur={wizard.validation.handleBlur}
        noValidate
        className={styles.stepPanel}
      >
        <h2 ref={stepHeading} tabIndex={-1} className={styles.stepTitle}>
          {currentStep.title}
        </h2>
        <p className={styles.stepIntro}>{currentStep.description}</p>
        {step === SelectionStep.Category && (
          <CategoryStep
            categories={wizard.categories}
            value={selection.category}
            error={errors.category}
            onChange={wizard.chooseCategory}
            translations={translations}
          />
        )}
        {step === SelectionStep.Machine && (
          <MachineStep
            locale={locale}
            machines={wizard.machines}
            value={selection.machine}
            error={errors.machine}
            onChange={wizard.chooseMachine}
            translations={translations}
          />
        )}
        {step === SelectionStep.Requirements && machine && (
          <RequirementsStep
            machine={machine}
            selection={selection}
            errors={errors}
            onChange={wizard.updateField}
            onChangeEquipment={() => wizard.goToStep(SelectionStep.Category)}
            translations={translations}
          />
        )}
        {step === SelectionStep.Review && machine && (
          <ReviewStep
            rows={wizard.summary}
            onEdit={wizard.goToStep}
            translations={translations}
          />
        )}
        <WizardActions
          onBack={wizard.hasPreviousStep ? wizard.previousStep : undefined}
          backLabel={translations.back}
          nextLabel={translations.next}
          nextDisabled={!wizard.validation.isValid}
          isLastStep={wizard.isLastStep}
          finalAction={
            machine && (
              <WizardActionLink
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(wizard.message)}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {translations.send}
              </WizardActionLink>
            )
          }
        />
      </form>
    </div>
  );
}
