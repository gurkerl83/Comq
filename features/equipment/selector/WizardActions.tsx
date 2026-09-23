import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { Link } from '../../../components/Link';
import type { WithoutClassName } from './types';
import styles from './WizardActions.module.css';

type WizardActionsProps = {
  onBack?: () => void;
  backLabel: string;
  nextLabel: string;
  nextDisabled: boolean;
  isLastStep: boolean;
  finalAction?: ReactNode;
};

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
        <button
          type='button'
          className={styles.secondaryButton}
          onClick={onBack}
        >
          {backLabel}
        </button>
      )}
      {isLastStep ? (
        finalAction
      ) : (
        <button
          className={styles.primaryButton}
          type='submit'
          disabled={nextDisabled}
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}

export function WizardActionLink(
  props: WithoutClassName<ComponentPropsWithoutRef<'a'>> & { href: string }
) {
  return <Link native {...props} className={styles.primaryButton} />;
}
