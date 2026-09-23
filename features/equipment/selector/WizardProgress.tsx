import styles from './WizardProgress.module.css';

type WizardProgressProps = {
  steps: readonly { id: string; shortTitle: string }[];
  currentIndex: number;
  label: string;
};

export function WizardProgress({
  steps,
  currentIndex,
  label
}: WizardProgressProps) {
  return (
    <ol className={styles.progress} aria-label={label}>
      {steps.map((item, index) => {
        let className = styles.progressItem;
        let ariaCurrent: 'step' | undefined;

        if (index === currentIndex) {
          className += ` ${styles.progressCurrent}`;
          ariaCurrent = 'step';
        } else if (index < currentIndex) {
          className += ` ${styles.progressComplete}`;
        }

        return (
          <li key={item.id} aria-current={ariaCurrent} className={className}>
            <span className={styles.progressNumber} aria-hidden='true'>
              {index + 1}
            </span>
            <span>{item.shortTitle}</span>
          </li>
        );
      })}
    </ol>
  );
}
