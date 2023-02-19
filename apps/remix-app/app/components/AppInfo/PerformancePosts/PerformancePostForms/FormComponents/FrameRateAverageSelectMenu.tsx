import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import { convertFrameRateToDescription } from '~/lib/conversions/rating-conversions';
import type { FrameRate } from '~/interfaces';

export const frameRateAverageOptions: SelectOption<FrameRate | 'None'>[] = [
  {
    name: 'Not Sure',
    value: 'None',
  },
  {
    name: convertFrameRateToDescription('VeryLow'),
    value: 'VeryLow',
  },
  {
    name: convertFrameRateToDescription('Low'),
    value: 'Low',
  },
  {
    name: convertFrameRateToDescription('Medium'),
    value: 'Medium',
  },
  {
    name: convertFrameRateToDescription('High'),
    value: 'High',
  },
  {
    name: convertFrameRateToDescription('VeryHigh'),
    value: 'VeryHigh',
  },
];

export default function FrameRateAverageSelectMenu({
  defaultValue,
  fieldError,
}: {
  defaultValue?: FrameRate | null;
  fieldError?: string;
}) {
  return (
    <SelectMenu
      name="performancePostFrameRateAverage"
      defaultValue={defaultValue ? {
        name: convertFrameRateToDescription(defaultValue),
        value: defaultValue,
      } : { name: 'Not Sure', value: 'None' }}
      options={frameRateAverageOptions}
      labelText="Average Frame Rate"
      fieldError={fieldError}
    />
  );
}
