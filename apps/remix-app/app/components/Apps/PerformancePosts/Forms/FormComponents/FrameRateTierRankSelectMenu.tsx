import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import { convertFrameRateTierRankToDescription } from '~/lib/conversions/rating-conversions';
import type { FrameRateTierRank } from '~/types';

export const frameRateAverageOptions: SelectOption<FrameRateTierRank | 'None'>[] = [
  {
    name: 'Not Sure',
    value: 'None',
  },
  {
    name: convertFrameRateTierRankToDescription('FTier'),
    value: 'FTier',
  },
  {
    name: convertFrameRateTierRankToDescription('DTier'),
    value: 'DTier',
  },
  {
    name: convertFrameRateTierRankToDescription('CTier'),
    value: 'CTier',
  },
  {
    name: convertFrameRateTierRankToDescription('BTier'),
    value: 'BTier',
  },
  {
    name: convertFrameRateTierRankToDescription('ATier'),
    value: 'ATier',
  },
  {
    name: convertFrameRateTierRankToDescription('STier'),
    value: 'STier',
  },
];

export default function FrameRateTierRankSelectMenu({
  name,
  defaultValue,
  fieldError,
}: {
  name: string;
  defaultValue?: FrameRateTierRank | null;
  fieldError?: string;
}) {
  return (
    <SelectMenu
      name={name}
      defaultValue={defaultValue ? {
        name: convertFrameRateTierRankToDescription(defaultValue),
        value: defaultValue,
      } : { name: 'Not Sure', value: 'None' }}
      options={frameRateAverageOptions}
      labelText="Average Frame Rate"
      fieldError={fieldError}
    />
  );
}
