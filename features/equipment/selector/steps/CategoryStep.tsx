import { hasError } from '../../../../lib/forms/errors';
import type { EquipmentCategory } from '../../types';
import type { EquipmentSelection } from '../../selection';
import type { ChoiceProps } from '../types';
import { RadioGroup } from '../controls/RadioGroup';
import { RadioOption } from '../controls/RadioOption';

type CategoryStepProps = ChoiceProps<EquipmentSelection['category']> & {
  categories: readonly EquipmentCategory[];
};

export function CategoryStep({
  categories,
  value,
  error,
  onChange,
  translations
}: CategoryStepProps) {
  return (
    <RadioGroup
      name='category'
      legend={translations.category}
      hideLegend
      error={error}
    >
      {categories.map(category => (
        <RadioOption
          key={category.id}
          name='category'
          value={category.id}
          checked={value === category.id}
          onChange={() => onChange(category.id)}
          required
          invalid={hasError(error)}
          label={category.name}
          description={category.description}
        />
      ))}
    </RadioGroup>
  );
}
