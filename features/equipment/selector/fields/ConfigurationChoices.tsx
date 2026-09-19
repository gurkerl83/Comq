import { hasError } from '../../../../lib/forms/errors';
import type { EquipmentEntry } from '../../catalogue';
import type { EquipmentSelection } from '../../selection';
import type { ChoiceProps } from '../types';
import { RadioGroup } from '../controls/RadioGroup';
import { RadioOption } from '../controls/RadioOption';

type ConfigurationChoicesProps = ChoiceProps<EquipmentSelection['variant']> & {
  variants: Readonly<EquipmentEntry['variants']>;
};

export function ConfigurationChoices({
  variants,
  value,
  error,
  onChange,
  translations
}: ConfigurationChoicesProps) {
  return (
    <RadioGroup
      name='variant'
      legend={translations.configuration}
      error={error}
    >
      {variants.map(variant => (
        <RadioOption
          key={variant.id}
          name='variant'
          value={variant.id}
          checked={value === variant.id}
          invalid={hasError(error)}
          onChange={() => onChange(variant.id)}
          label={variant.label}
          description={variant.description}
        />
      ))}
      <RadioOption
        name='variant'
        value=''
        checked={!value}
        invalid={hasError(error)}
        onChange={() => onChange('')}
        label={translations.configurationAdvice}
      />
    </RadioGroup>
  );
}
