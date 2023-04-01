import type {
  RatingMedal,
  FrameRate,
  GamepadRating,
} from '~/interfaces';

export function convertRatingMedalToFullText(ratingMedal: RatingMedal) {
  switch (ratingMedal) {
    case 'Platinum':
      return `${ratingMedal} - ${convertRatingMedalToDescription(ratingMedal)}`;
    case 'Gold':
      return `${ratingMedal} - ${convertRatingMedalToDescription(ratingMedal)}`;
    case 'Silver':
      return `${ratingMedal} - ${convertRatingMedalToDescription(ratingMedal)}`;
    case 'Bronze':
      return `${ratingMedal} - ${convertRatingMedalToDescription(ratingMedal)}`;
    case 'Borked':
      return `${ratingMedal} - ${convertRatingMedalToDescription(ratingMedal)}`;
  }
}

export function convertRatingMedalToDescription(ratingMedal: RatingMedal) {
  switch (ratingMedal) {
    case 'Platinum':
      return 'Runs [ perfect ]';
    case 'Gold':
      return 'Runs [ perfect after tweaks ]';
    case 'Silver':
      return 'Runs [ with minor issues ]';
    case 'Bronze':
      return 'Runs [ often crashes ]';
    case 'Borked':
      return `Doesn't Run`;
  }
}

export function convertFrameRateToDescription(frameRateAverage: FrameRate) {
  switch (frameRateAverage) {
    case 'VeryLow':
      return '0 - 25 FPS';
    case 'Low':
      return '25 - 40 FPS';
    case 'Medium':
      return '40 - 60 FPS';
    case 'High':
      return '60 - 120 FPS';
    case 'VeryHigh':
      return '120+ FPS';
  }
}

export function convertGamepadRatingToFullText(gamepadRating: GamepadRating) {
  switch (gamepadRating) {
    case 'GamepadBorked':
      return `${convertGamepadRatingToMedalText('GamepadBorked')} - ${convertGamepadRatingToDescription('GamepadBorked')}`;
    case 'GamepadBronze':
      return `${convertGamepadRatingToMedalText('GamepadBronze')} - ${convertGamepadRatingToDescription('GamepadBronze')}`;
    case 'GamepadSilver':
      return `${convertGamepadRatingToMedalText('GamepadSilver')} - ${convertGamepadRatingToDescription('GamepadSilver')}`;
    case 'GamepadGold':
      return `${convertGamepadRatingToMedalText('GamepadGold')} - ${convertGamepadRatingToDescription('GamepadGold')}`;
    case 'GamepadPlatinum':
      return `${convertGamepadRatingToMedalText('GamepadPlatinum')} - ${convertGamepadRatingToDescription('GamepadPlatinum')}`;
  }
}

export function convertGamepadRatingToDescription(gamepadRating: GamepadRating) {
  switch (gamepadRating) {
    case 'GamepadBorked':
      return `Doesn't work`;
    case 'GamepadBronze':
      return `Works with major issues`;
    case 'GamepadSilver':
      return `Works with minor issues`;
    case 'GamepadGold':
      return `Works perfect after tweaks`;
    case 'GamepadPlatinum':
      return `Works perfect`;
  }
}

export function convertGamepadRatingToMedalText(gamepadRating: GamepadRating) {
  switch (gamepadRating) {
    case 'GamepadBorked':
      return `Borked`;
    case 'GamepadBronze':
      return `Bronze`;
    case 'GamepadSilver':
      return `Silver`;
    case 'GamepadGold':
      return `Gold`;
    case 'GamepadPlatinum':
      return `Platinum`;
  }
}

export function convertRatingMedalToNumber(ratingMedal: RatingMedal) {
  switch (ratingMedal) {
    case 'Borked':
      return 0;
    case 'Bronze':
      return 1;
    case 'Silver':
      return 2;
    case 'Gold':
      return 3;
    case 'Platinum':
      return 4;
  }
}

export function convertNumberToRatingMedal(ratingMedalNumber: 0 | 1 | 2 | 3 | 4): RatingMedal {
  switch (ratingMedalNumber) {
    case 0:
      return 'Borked';
    case 1:
      return 'Bronze';
    case 2:
      return 'Silver';
    case 3:
      return 'Gold';
    case 4:
      return 'Platinum';
  }
}

export function convertFrameRateToNumber(frameRate: FrameRate) {
  switch (frameRate) {
    case 'VeryLow':
      return 0;
    case 'Low':
      return 1;
    case 'Medium':
      return 2;
    case 'High':
      return 3;
    case 'VeryHigh':
      return 4;
  }
}

export function convertNumberToFrameRate(frameRateNumber: 0 | 1 | 2 | 3 | 4): FrameRate {
  switch (frameRateNumber) {
    case 0:
      return 'VeryLow';
    case 1:
      return 'Low';
    case 2:
      return 'Medium';
    case 3:
      return 'High';
    case 4:
      return 'VeryHigh';
  }
}

export function convertGamepadRatingToNumber(gamepadRating: GamepadRating) {
  switch (gamepadRating) {
    case 'GamepadBorked':
      return 0;
    case 'GamepadBronze':
      return 1;
    case 'GamepadSilver':
      return 2;
    case 'GamepadGold':
      return 3;
    case 'GamepadPlatinum':
      return 4;
  }
}

export function convertNumberToGamepadRating(gamepadRatingNumber: 0 | 1 | 2 | 3 | 4): GamepadRating {
  switch (gamepadRatingNumber) {
    case 0:
      return 'GamepadBorked';
    case 1:
      return 'GamepadBronze';
    case 2:
      return 'GamepadSilver';
    case 3:
      return 'GamepadGold';
    case 4:
      return 'GamepadPlatinum';
  }
}
