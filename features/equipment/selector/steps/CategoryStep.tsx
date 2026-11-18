import {
  useController,
  useFormContext,
  useFormState,
  useWatch
} from 'react-hook-form';

import type { EquipmentCategory } from '../../types';
import type { EquipmentSelection } from '../../selection';
import { ChoiceCard } from '../controls/ChoiceCard';
import { RadioGroup } from '../controls/RadioGroup';
import styles from './CategoryStep.module.css';

/**
 * Catalogue categories and the domain transition that initializes their machines.
 */
type CategoryStepProps = {
  /** Categories available in this catalogue. */
  categories: readonly EquipmentCategory[];
  /** Apply the category and dependent machine defaults together. */
  onChange: (value: EquipmentSelection['category']) => void;
};

/**
 * The catalogue's categories, each a ChoiceCard with its name and
 * description.
 */
export function CategoryStep({ categories, onChange }: CategoryStepProps) {
  const { control } = useFormContext<EquipmentSelection>();

  const selectedCategory = useWatch({ control, name: 'category' });
  const { errors } = useFormState({ control, name: 'category' });

  // The wizard handles category changes together with machine/configuration
  // resets. Keep RHF's focus and blur handling for the cards.
  const {
    field: { ref, onBlur }
  } = useController({ control, name: 'category' });

  const categoryError = errors.category?.message;

  return (
    <RadioGroup error={categoryError}>
      {categories.map(category => (
        <ChoiceCard
          key={category.id}
          ref={ref}
          onBlur={onBlur}
          selected={selectedCategory === category.id}
          onSelect={() => onChange(category.id)}
        >
          <span className={styles.title}>{category.name}</span>
          <span className={styles.description}>{category.description}</span>
        </ChoiceCard>
      ))}
    </RadioGroup>
  );
}
