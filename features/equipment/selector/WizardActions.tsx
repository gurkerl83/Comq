import type { ReactNode } from 'react';

import { Button } from '../../../components/Button';
import styles from './WizardActions.module.css';

type WizardActionsProps = {
  /** Goes to the previous step; without it, Back is left out. */
  onBack?: () => void;
  /** The text of the Back button. */
  backLabel: string;
  /** The text of the Continue button. */
  nextLabel: string;
  /** Disables Continue, such as while the option editor is open. */
  nextDisabled: boolean;
  /** Shows finalAction in place of Continue. */
  isLastStep: boolean;
  /** The button of the last step, such as opening the enquiry in WhatsApp. */
  finalAction?: ReactNode;
};

/**
 * The button row below a wizard step. Back sits on the left when the step has
 * a previous one. On the right sits the submit button that continues, or on
 * the last step the button passed in as finalAction. The row places its
 * buttons itself, so finalAction needs no class.
 */
export function WizardActions({
  onBack,
  backLabel,
  nextLabel,
  nextDisabled,
  isLastStep,
  finalAction
}: WizardActionsProps) {
  return (
    <div className={styles.actions}>
      {onBack && (
        <Button
          variant='secondary'
          className={styles.back}
          type='button'
          onClick={onBack}
        >
          {backLabel}
        </Button>
      )}
      {isLastStep ? (
        finalAction
      ) : (
        <Button variant='primary' type='submit' disabled={nextDisabled}>
          {nextLabel}
        </Button>
      )}
    </div>
  );
}
