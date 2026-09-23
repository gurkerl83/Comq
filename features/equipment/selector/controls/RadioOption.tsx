import styles from './RadioOption.module.css';

type RadioOptionProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  required?: boolean;
  invalid?: boolean;
  appearance?: 'card' | 'sharedRows';
};

export function RadioOption({
  name,
  value,
  checked,
  onChange,
  label,
  description,
  required,
  invalid,
  appearance = 'card'
}: RadioOptionProps) {
  return (
    <label className={`${styles.option} ${styles[appearance]}`}>
      <input
        type='radio'
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        required={required}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${name}-error` : undefined}
      />
      {description !== undefined ? (
        <span>
          <span className={styles.title}>{label}</span>
          <span className={styles.description}>{description}</span>
        </span>
      ) : (
        <span className={styles.title}>{label}</span>
      )}
    </label>
  );
}
