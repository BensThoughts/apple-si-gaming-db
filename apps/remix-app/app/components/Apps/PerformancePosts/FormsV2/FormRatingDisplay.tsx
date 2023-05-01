import TextPill from '~/components/TextPill';
import TierRankBadge from '~/components/TierRankBadge';
import TierRankPill from '~/components/TierRankPill';
import {
  convertFrameRateTierRankToDescription,
  convertGamepadTierRankToDescription,
  convertRatingTierRankToDescription,
} from '~/lib/conversions/rating-conversions';
import { usePerformancePostFormState } from './FormContext/PerformancePostFormContext';
import type { FrameRateTierRank, GamepadOption, GamepadTierRank, RatingTierRank } from '~/types';

function RatingContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="italic text-primary-faded font-light text-sm">
        {title}
      </span>
      {children}
    </div>
  );
}

export function RatingTierRankDisplay({ ratingTierRank }: { ratingTierRank?: RatingTierRank}) {
  return (
    <RatingContainer title="Tier Rank">
      {ratingTierRank ? (
      <TierRankBadge tierRank={ratingTierRank}>
        {convertRatingTierRankToDescription(ratingTierRank)}
      </TierRankBadge>
    ) : (
      <TextPill>
        None Given
      </TextPill>
    )}
    </RatingContainer>
  );
}

export function FrameRateTierRankDisplay({
  frameRateTierRank,
  frameRateStutters,
  ratingTierRank,
}: {
  frameRateTierRank?: FrameRateTierRank;
  frameRateStutters: boolean;
  ratingTierRank?: RatingTierRank; // optional to match color of rating tier rank if
                                   // only stutters is turned on without frame
                                   // rate rating
}) {
  return (
    <RatingContainer title="Frame Rate">
      {frameRateTierRank || frameRateStutters ? (
      <div className="flex gap-1">
        {frameRateTierRank && (
          <TierRankBadge tierRank={frameRateTierRank}>
            {convertFrameRateTierRankToDescription(frameRateTierRank)}
          </TierRankBadge>
        )}
        {frameRateStutters && (
          <TierRankPill tierRank={frameRateTierRank ? frameRateTierRank : ratingTierRank ? ratingTierRank : 'STier'}>
            Stutters
          </TierRankPill>
        )}
      </div>
    ) : (
      <TextPill>
        None Given
      </TextPill>
    )}
    </RatingContainer>
  );
}

export function GamepadTierRankDisplay({
  gamepadOption,
  gamepadTierRank,
}: {
  gamepadOption?: GamepadOption;
  gamepadTierRank?: GamepadTierRank;
}) {
  return (
    <RatingContainer title="Gamepad">
      {(!gamepadOption && !gamepadTierRank) && (
        <TextPill>None Given</TextPill>
      )}
      {(gamepadOption && !gamepadTierRank) && (
        <TierRankBadge includeRatingLetter={false} tierRank="STier">
          {gamepadOption.description}
        </TierRankBadge>
      )}
      {(!gamepadOption && gamepadTierRank) && (
        <TierRankBadge tierRank={gamepadTierRank}>
          {convertGamepadTierRankToDescription(gamepadTierRank)}
        </TierRankBadge>
      )}
      {(gamepadOption && gamepadTierRank) && (
        <TierRankBadge tierRank={gamepadTierRank}>
          {`${gamepadOption.description} - ${convertGamepadTierRankToDescription(gamepadTierRank)}`}
        </TierRankBadge>
      )}
    </RatingContainer>
  );
}

export default function FormRatingDisplay() {
  const { state: {
    ratingTierRank,
    frameRateTierRank,
    frameRateStutters,
    gamepadOption,
    gamepadTierRank,
  } } = usePerformancePostFormState();
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <RatingTierRankDisplay ratingTierRank={ratingTierRank} />
      <FrameRateTierRankDisplay
        frameRateTierRank={frameRateTierRank}
        frameRateStutters={frameRateStutters}
      />
      <GamepadTierRankDisplay
        gamepadOption={gamepadOption}
        gamepadTierRank={gamepadTierRank}
      />
    </div>
  );
}
