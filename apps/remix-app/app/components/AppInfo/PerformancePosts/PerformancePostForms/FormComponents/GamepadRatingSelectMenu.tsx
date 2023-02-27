import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import { convertGamepadRatingToFullText } from '~/lib/conversions/rating-conversions';
import type { GamepadRating } from '~/interfaces';

export const gamepadRatingOptions: SelectOption<GamepadRating | 'None'>[] = [
  {
    name: 'None',
    value: 'None',
  },
  {
    name: convertGamepadRatingToFullText('GamepadPlatinum'),
    value: 'GamepadPlatinum',
  },
  {
    name: convertGamepadRatingToFullText('GamepadGold'),
    value: 'GamepadGold',
  },
  {
    name: convertGamepadRatingToFullText('GamepadSilver'),
    value: 'GamepadSilver',
  },
  {
    name: convertGamepadRatingToFullText('GamepadBronze'),
    value: 'GamepadBronze',
  },
  {
    name: convertGamepadRatingToFullText('GamepadBorked'),
    value: `GamepadBorked`,
  },
];


export default function GamepadRatingSelectMenu({
  defaultValue,
  fieldError,
}: {
  defaultValue?: GamepadRating | null;
  fieldError?: string;
}) {
  return (
    <SelectMenu
      name="performancePostGamepadRating"
      defaultValue={defaultValue ? {
        name: convertGamepadRatingToFullText(defaultValue),
        value: defaultValue,
      } : { name: 'None', value: 'None' }}
      options={gamepadRatingOptions}
      labelText="Controller Rating"
      fieldError={fieldError}
      // menuSize="large"
    />
  );
}
