'use client';

import { useCallback, useEffect, useRef, type FormEvent } from 'react';
import { FormProvider } from 'react-hook-form';

import { WHATSAPP_URL } from '../../../lib/site/config';
import { Link } from '../../../components/Link';
import type { EquipmentSelection } from '../selection';
import { SelectionStep, SELECTION_STEP_ORDER } from '../selection-steps';
import { CategoryStep } from './steps/CategoryStep';
import { MachineStep } from './steps/MachineStep';
import { RequirementsStep } from './steps/RequirementsStep';
import { ReviewStep } from './steps/ReviewStep';
import type { SelectorProps } from './types';
import { useEquipmentSelection } from './useEquipmentSelection';
import { WizardActions } from './WizardActions';
import { WizardProgress } from './WizardProgress';
import styles from './EquipmentWizard.module.css';

/**
 * Client boundary for the native form and its retained enquiry answers.
 *
 * 1. The server prepares initialSelection and the wizard key. Registered native
 *    defaults and controlled equipment radios preserve that initial HTML.
 * 2. FormProvider shares the enquiry with feature components. Base controls
 *    continue accepting native props and do not depend on React Hook Form.
 * 3. Continue/Enter prevent browser submission and trigger scoped validation.
 *    The whole enquiry is checked before Review; WhatsApp remains explicit.
 * 4. Step changes retain answers and touched fields. Navigation focuses the
 *    new heading; validation focuses its target after the owning step mounts.
 */
export function EquipmentWizard({
  locale,
  catalogue,
  translations,
  initialSelection
}: SelectorProps & { initialSelection: EquipmentSelection }) {
  const wizard = useEquipmentSelection(
    catalogue,
    initialSelection,
    translations
  );
  const { form, step, machine } = wizard;
  const { setFocus } = form;
  const currentStep = translations.steps[step];
  const progressSteps = SELECTION_STEP_ORDER.map(id => ({
    id,
    shortTitle: translations.steps[id].shortTitle
  }));
  const wizardStart = useRef<HTMLDivElement>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const customizeButton = useRef<HTMLButtonElement>(null);
  const previousStep = useRef(step);
  const pendingFocus = useRef<keyof EquipmentSelection | null>(null);

  const focusInvalidField = useCallback(
    (field: keyof EquipmentSelection) => {
      if (field === 'configuration') {
        (customizeButton.current ?? stepHeading.current)?.focus();
      } else {
        setFocus(field);
      }
    },
    [setFocus]
  );

  // Focus the heading without scrolling, then align the wizard start so the
  // progress remains visible. Error targets are focused after their step mounts.
  // Initial rendering leaves page focus and scroll unchanged.
  useEffect(() => {
    if (previousStep.current === step) return;
    stepHeading.current?.focus({ preventScroll: true });
    wizardStart.current?.scrollIntoView({ block: 'start' });
    if (pendingFocus.current) {
      focusInvalidField(pendingFocus.current);
      pendingFocus.current = null;
    }
    previousStep.current = step;
  }, [step, focusInvalidField]);

  /**
   * Continue/Enter call nextStep(), which validates through RHF's trigger()
   * without marking the enquiry submitted.
   */
  async function handleStepSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = await wizard.nextStep();
    if (!invalid) return;
    if (invalid.step === step) {
      focusInvalidField(invalid.field);
    } else {
      pendingFocus.current = invalid.field;
      wizard.goToStep(invalid.step);
    }
  }

  if (!catalogue.length)
    return (
      <p>
        {translations.emptyCatalogue}{' '}
        <Link native href={WHATSAPP_URL}>
          {translations.contact}
        </Link>
      </p>
    );

  return (
    <FormProvider {...form}>
      <div ref={wizardStart} className={styles.wizard}>
        <WizardProgress
          steps={progressSteps}
          currentIndex={wizard.stepIndex}
          label={translations.progress}
        />
        <form
          onSubmit={handleStepSubmit}
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
              onChange={wizard.chooseCategory}
              translations={translations}
            />
          )}
          {step === SelectionStep.Machine && (
            <MachineStep
              locale={locale}
              machines={wizard.machines}
              customization={wizard.customization}
              customizationRef={customizeButton}
              onChange={wizard.chooseMachine}
              translations={translations}
            />
          )}
          {step === SelectionStep.Requirements && machine && (
            <RequirementsStep
              machine={machine}
              startDateRef={wizard.startDateRef}
              onChangeEquipment={() => wizard.goToStep(SelectionStep.Category)}
              translations={translations}
            />
          )}
          {step === SelectionStep.Review && machine && (
            <ReviewStep
              locale={locale}
              machine={machine}
              onBack={wizard.previousStep}
              onEdit={wizard.goToStep}
              translations={translations}
            />
          )}
          {!wizard.isLastStep && (
            <WizardActions
              onBack={wizard.hasPreviousStep ? wizard.previousStep : undefined}
              backLabel={translations.back}
              nextLabel={translations.next}
              nextDisabled={wizard.isAdvancing || wizard.customization.editing}
              isLastStep={false}
            />
          )}
        </form>
      </div>
    </FormProvider>
  );
}
