import styles from './WizardProgress.module.css';

type WizardProgressProps = {
  /** The steps in order, each with its ID and short title. */
  steps: readonly { id: string; shortTitle: string }[];
  /** The position of the current step in steps. */
  currentIndex: number;
};

/**
 * The numbered list of wizard steps. The current step gets
 * styles.progressCurrent, the steps before it styles.progressComplete.
 */
export function WizardProgress({ steps, currentIndex }: WizardProgressProps) {
  return (
    <ol className={styles.progress}>
      {steps.map((item, index) => {
        let className = styles.progressItem;

        if (index === currentIndex) {
          className += ` ${styles.progressCurrent}`;
        } else if (index < currentIndex) {
          className += ` ${styles.progressComplete}`;
        }

        return (
          <li key={item.id} className={className}>
            <span className={styles.progressNumber}>{index + 1}</span>
            <span>{item.shortTitle}</span>
          </li>
        );
      })}
    </ol>
  );
}
