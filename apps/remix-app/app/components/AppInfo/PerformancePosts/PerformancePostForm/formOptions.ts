import type { FrameRate, GamepadRating, RatingMedal } from '~/interfaces';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';

import {
  convertFrameRateToDescription,
  convertRatingMedalToFullText,
  convertGamepadRatingToFullText,
} from '~/lib/conversions/rating-conversions';

export const steamAppRatingOptions: SelectOption<RatingMedal | 'None'>[] = [
  {
    name: 'None',
    value: 'None',
  },
  {
    name: convertRatingMedalToFullText('Platinum'),
    value: 'Platinum',
  },
  {
    name: convertRatingMedalToFullText('Gold'),
    value: 'Gold',
  },
  {
    name: convertRatingMedalToFullText('Silver'),
    value: 'Silver',
  },
  {
    name: convertRatingMedalToFullText('Bronze'),
    value: 'Bronze',
  },
  {
    name: convertRatingMedalToFullText('Borked'),
    value: 'Borked',
  },
];

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
