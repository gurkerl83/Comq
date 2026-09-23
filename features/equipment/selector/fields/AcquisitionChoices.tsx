import { useFormContext, useFormState } from 'react-hook-form';

import { hasError } from '../../../../lib/forms/errors';
import { AcquisitionMode, type EquipmentSelection } from '../../selection';
import type { SelectorContent } from '../../selector-content';
import { RadioGroup } from '../controls/RadioGroup';
import { RadioOption } from '../controls/RadioOption';

/**
 * Translated copy for the purchase and rental choices.
 */
type AcquisitionChoicesProps = {
  /** Group legend and native radio labels. */
  translations: SelectorContent;
};

export function AcquisitionChoices({ translations }: AcquisitionChoicesProps) {
  const { control, register, getValues } = useFormContext<EquipmentSelection>();

  const { errors } = useFormState({
    control,
    name: 'acquisition',
    exact: true
  });

  const error = errors.acquisition?.message;

  return (
    <RadioGroup
      name='acquisition'
      legend={translations.acquisition}
      error={error}
    >
      {Object.values(AcquisitionMode).map(mode => (
        <RadioOption
          key={mode}
          {...register('acquisition')}
          value={mode}
          defaultChecked={getValues('acquisition') === mode}
          invalid={hasError(error)}
          label={translations[mode]}
        />
      ))}
    </RadioGroup>
  );
}
