import SelectMenuWithIcon from '~/components/FormComponents/SelectMenuWithIcon';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import { convertFrameRateTierRankToDescription } from '~/lib/conversions/rating-conversions';
import type { FrameRateTierRank } from '~/types';
import { MonitorIcon } from '~/components/Icons/FeatherIcons';

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
  onChange,
}: {
  name: string;
  defaultValue?: FrameRateTierRank | null;
  onChange?(e: SelectOption<FrameRateTierRank | 'None'>): void;
}) {
  function onSelectionChange(selection: SelectOption<FrameRateTierRank | 'None'>) {
    if (onChange) {
      onChange(selection);
    }
  }
  return (
    <SelectMenuWithIcon
      name={name}
      defaultValue={defaultValue ? {
        name: convertFrameRateTierRankToDescription(defaultValue),
        value: defaultValue,
      } : { name: 'Not Sure', value: 'None' }}
      options={frameRateAverageOptions}
      labelText="Average Frame Rate"
      Icon={MonitorIcon}
      onChange={onSelectionChange}
      // fieldError={fieldError}
    />
  );
}
