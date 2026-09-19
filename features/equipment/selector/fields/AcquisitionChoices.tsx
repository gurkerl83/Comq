import { hasError } from '../../../../lib/forms/errors';
import { AcquisitionMode, type EquipmentSelection } from '../../selection';
import type { ChoiceProps } from '../types';
import { RadioGroup } from '../controls/RadioGroup';
import { RadioOption } from '../controls/RadioOption';

type AcquisitionChoicesProps = ChoiceProps<EquipmentSelection['acquisition']>;

export function AcquisitionChoices({
  value,
  error,
  onChange,
  translations
}: AcquisitionChoicesProps) {
  return (
    <RadioGroup
      name='acquisition'
      legend={translations.acquisition}
      error={error}
    >
      {Object.values(AcquisitionMode).map(mode => (
        <RadioOption
          key={mode}
          name='acquisition'
          value={mode}
          checked={value === mode}
          invalid={hasError(error)}
          onChange={() => onChange(mode)}
          label={translations[mode]}
        />
      ))}
    </RadioGroup>
  );
}
