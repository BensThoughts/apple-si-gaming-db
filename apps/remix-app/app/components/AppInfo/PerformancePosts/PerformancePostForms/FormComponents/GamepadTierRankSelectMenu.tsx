import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import { convertGamepadTierRankToFullText } from '~/lib/conversions/rating-conversions';
import type { GamepadTierRank } from '~/interfaces';

export const gamepadRatingOptions: SelectOption<GamepadTierRank | 'None'>[] = [
  {
    name: 'None',
    value: 'None',
  },
  {
    name: convertGamepadTierRankToFullText('STier'),
    value: 'STier',
  },
  {
    name: convertGamepadTierRankToFullText('ATier'),
    value: 'ATier',
  },
  {
    name: convertGamepadTierRankToFullText('BTier'),
    value: 'BTier',
  },
  {
    name: convertGamepadTierRankToFullText('CTier'),
    value: 'CTier',
  },
  {
    name: convertGamepadTierRankToFullText('FTier'),
    value: 'FTier',
  },
];


export default function GamepadTierRankSelectMenu({
  name,
  defaultValue,
  fieldError,
}: {
  name: string;
  defaultValue?: GamepadTierRank | null;
  fieldError?: string;
}) {
  return (
    <SelectMenu
      name={name}
      defaultValue={defaultValue ? {
        name: convertGamepadTierRankToFullText(defaultValue),
        value: defaultValue,
      } : { name: 'None', value: 'None' }}
      options={gamepadRatingOptions}
      labelText="Controller Rating"
      fieldError={fieldError}
      // menuSize="large"
    />
  );
}
