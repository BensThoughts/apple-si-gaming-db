import TextPill from '~/components/TextPill';
import TierRankBadge from '~/components/TierRankBadge';
import TierRankPill from '~/components/TierRankPill';
import {
  convertFrameRateTierRankToDescription,
  convertGamepadTierRankToDescription,
  convertRatingTierRankToDescription,
} from '~/lib/conversions/rating-conversions';
import { usePerformancePostFormState } from './FormContext/PerformancePostFormContext';
import type { FrameRateTierRank, GamepadTierRank, RatingTierRank } from '~/types';

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
  gamepadName,
  gamepadTierRank,
}: {
  gamepadName?: string;
  gamepadTierRank?: GamepadTierRank;
}) {
  return (
    <RatingContainer title="Gamepad">
      {(!gamepadName && !gamepadTierRank) && (
        <TextPill>None Given</TextPill>
      )}
      {(gamepadName && !gamepadTierRank) && (
        <TierRankBadge includeRatingLetter={false} tierRank="STier">
          {gamepadName}
        </TierRankBadge>
      )}
      {(!gamepadName && gamepadTierRank) && (
        <TierRankBadge tierRank={gamepadTierRank}>
          {convertGamepadTierRankToDescription(gamepadTierRank)}
        </TierRankBadge>
      )}
      {(gamepadName && gamepadTierRank) && (
        <TierRankBadge tierRank={gamepadTierRank}>
          {`${gamepadName} - ${convertGamepadTierRankToDescription(gamepadTierRank)}`}
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
    gamepadName,
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
        gamepadName={gamepadName}
        gamepadTierRank={gamepadTierRank}
      />
    </div>
  );
}
