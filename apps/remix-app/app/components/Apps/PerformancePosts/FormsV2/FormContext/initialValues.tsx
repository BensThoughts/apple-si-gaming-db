import type { FrameRateTierRankOption } from '../FormComponents/FrameRateRating/FrameRateTierRankRadioGroup';
import type { GamepadListboxOption } from '../FormComponents/GamepadRating/GamepadListbox';
import type { GamepadTierRankOption } from '../FormComponents/GamepadRating/GamepadTierRankRadioGroup';
import type { RatingTierRankSelectOption } from '../FormComponents/RatingTierRankSelectMenu';
import type { SystemSpecSelectOption } from '../FormComponents/SystemSelectMenuCard/SystemSelectMenu';

export const initialRatingTierRankSelectOption: RatingTierRankSelectOption = {
  name: 'None',
  value: 'None',
};

export const initialFrameRateTierRankSelectOption: FrameRateTierRankOption = {
  name: 'Not Sure',
  value: 'None',
};

export const initialGamepadOption: GamepadListboxOption = {
  name: 'None',
  value: -1,
};

export const initialGamepadTierRankOption: GamepadTierRankOption = {
  name: 'None',
  value: 'None',
};

export const initialSystemSpecOption: SystemSpecSelectOption = {
  name: 'None',
  value: -1,
};
