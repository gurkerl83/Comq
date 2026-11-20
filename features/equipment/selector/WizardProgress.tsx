import styles from './WizardProgress.module.css';

/** One step in the progress list. */
type WizardProgressStep = {
  /** The step's ID, which keys its list item. */
  id: string;
  /** The step's short title, shown after its number. */
  shortTitle: string;
};

type WizardProgressProps = {
  /** The steps in order. */
  steps: readonly WizardProgressStep[];
  /** The position of the current step in steps. */
  currentIndex: number;
};

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
