import type { ReactNode } from 'react';

import { Button } from '../../../components/Button';
import styles from './WizardActions.module.css';

type WizardActionsProps = {
  onBack?: () => void;
  backLabel: string;
  nextLabel: string;
  nextDisabled: boolean;
  isLastStep: boolean;
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
