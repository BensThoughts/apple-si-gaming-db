import {
  prisma,
} from '../client';

import type {
  RatingMedal,
  GamepadRating,
  FrameRate,
  TierRank,
} from '@prisma/client';

type FrameRateTierRank = 'STier' | 'ATier' | 'BTier' | 'CTier' | 'DTier' | 'FTier';
type GamepadTierRank = 'STier' | 'ATier' | 'BTier' | 'CTier' | 'FTier';
type RatingTierRank = TierRank;


function convertGamepadToTier(gamepadRating: GamepadRating): GamepadTierRank | null | undefined {
  switch (gamepadRating) {
    case 'GamepadPlatinum':
      return 'STier';
    case 'GamepadGold':
      return 'ATier';
    case 'GamepadSilver':
      return 'BTier';
    case 'GamepadBronze':
      return 'CTier';
    case 'GamepadBorked':
      return 'FTier';
  }
}

function convertFrameRateToTier(frameRate: FrameRate): FrameRateTierRank | null | undefined {
  switch (frameRate) {
    case 'VeryHigh':
      return 'STier';
    case 'High':
      return 'ATier';
    case 'Medium':
      return 'BTier';
    case 'Low':
      return 'CTier';
    case 'VeryLow':
      return 'FTier';
  }
}

function convertRatingToTier(ratingMedal: RatingMedal): RatingTierRank {
  switch (ratingMedal) {
    case 'Platinum':
      return 'STier';
    case 'Gold':
      return 'ATier';
    case 'Silver':
      return 'BTier';
    case 'Bronze':
      return 'ETier';
    case 'Borked':
      return 'FTier';
  }
}

async function convertRatingMedalsToTierRanks() {
  console.log('Starting');
  const posts = await prisma.performancePost.findMany({
    select: {
      id: true,
      ratingMedal: true,
      frameRateAverage: true,
      gamepadRating: true,
    },
  });

  await Promise.all(
      posts.map(({ id, ratingMedal, frameRateAverage, gamepadRating }) => {
        return prisma.performancePost.update({
          where: {
            id,
          },
          data: {
            ratingTierRank: ratingMedal ? convertRatingToTier(ratingMedal) : undefined,
            frameRateTierRank: frameRateAverage ? convertFrameRateToTier(frameRateAverage) : undefined,
            gamepadTierRank: gamepadRating ? convertGamepadToTier(gamepadRating) : undefined,
          },
        });
      }),
  );
  console.log('DONE');
}

convertRatingMedalsToTierRanks();
