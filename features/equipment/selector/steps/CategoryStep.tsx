import { useFormContext, useFormState, useWatch } from 'react-hook-form';

import { hasError } from '../../../../lib/forms/errors';
import type { EquipmentCategory } from '../../types';
import type { EquipmentSelection } from '../../selection';
import type { SelectorContent } from '../../selector-content';
import { RadioGroup } from '../controls/RadioGroup';
import { RadioOption } from '../controls/RadioOption';

/**
 * Catalogue categories and the domain transition that initializes their machines.
 */
type CategoryStepProps = {
  /** Categories available in this catalogue. */
  categories: readonly EquipmentCategory[];
  /** Apply the category and dependent machine defaults together. */
  onChange: (value: EquipmentSelection['category']) => void;
  /** Localized legend and validation labels. */
  translations: SelectorContent;
};

export function CategoryStep({
  categories,
  onChange,
  translations
}: CategoryStepProps) {
  const { control, register } = useFormContext<EquipmentSelection>();

  const selectedCategory = useWatch({ control, name: 'category' });
  const { errors } = useFormState({ control, name: 'category' });

  // The wizard handles category changes together with machine/configuration
  // resets. Keep RHF's native registration and blur handling.
  const { name, ref, onBlur } = register('category');

  const categoryError = errors.category?.message;

  return (
    <RadioGroup
      name={name}
      legend={translations.category}
      hideLegend
      error={categoryError}
    >
      {categories.map(category => (
        <RadioOption
          key={category.id}
          name={name}
          ref={ref}
          onBlur={onBlur}
          value={category.id}
          checked={selectedCategory === category.id}
          onChange={() => onChange(category.id)}
          required
          invalid={hasError(categoryError)}
          label={category.name}
          description={category.description}
        />
      ))}
    </RadioGroup>
  );
}
