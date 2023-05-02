import TextPill from '~/components/TextPill';
import TierRankBadge from '~/components/TierRankBadge';
import TierRankPill from '~/components/TierRankPill';
import {
  convertFrameRateTierRankToDescription,
  convertGamepadTierRankToDescription,
  convertRatingTierRankToDescription,
} from '~/lib/conversions/rating-conversions';
import { usePerformancePostFormState } from './FormContext/PerformancePostFormContext';
import type { RatingTierRankSelectOption } from './FormComponents/RatingTierRankSelectMenu';
import type { FrameRateTierRankOption } from './FormComponents/FrameRateRating/FrameRateTierRankRadioGroup';
import { isTypeFrameRateTierRank, isTypeGamepadTierRank, isTypeRatingTierRank } from '~/lib/form-validators/posts';
import type { GamepadTierRankOption } from './FormComponents/GamepadRating/GamepadTierRankRadioGroup';

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

export function RatingTierRankDisplay({ ratingTierRank }: { ratingTierRank: RatingTierRankSelectOption['value']}) {
  return (
    <RatingContainer title="Tier Rank">
      {ratingTierRank != 'None' ? (
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
  frameRateTierRank: FrameRateTierRankOption['value'];
  frameRateStutters: boolean;
  ratingTierRank: RatingTierRankSelectOption['value']; // optional to match color of rating tier rank if
                                                       // only stutters is turned on without frame
                                                       // rate rating
}) {
  return (
    <RatingContainer title="Frame Rate">
      {frameRateTierRank != 'None' || frameRateStutters ? (
      <div className="flex gap-1">
        {isTypeFrameRateTierRank(frameRateTierRank) && (
          <TierRankBadge tierRank={frameRateTierRank}>
            {convertFrameRateTierRankToDescription(frameRateTierRank)}
          </TierRankBadge>
        )}
        {frameRateStutters && (
          <TierRankPill
            tierRank={
              isTypeFrameRateTierRank(frameRateTierRank)
                ? frameRateTierRank
                : isTypeRatingTierRank(ratingTierRank)
                  ? ratingTierRank
                  : 'STier'
            }
          >
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
  gamepadTierRank?: GamepadTierRankOption['value'];
}) {
  return (
    <RatingContainer title="Gamepad">
      {(!gamepadName && !isTypeGamepadTierRank(gamepadTierRank)) && (
        <TextPill>None Given</TextPill>
      )}
      {(gamepadName && !isTypeGamepadTierRank(gamepadTierRank)) && (
        <TierRankBadge includeRatingLetter={false} tierRank="STier">
          {gamepadName}
        </TierRankBadge>
      )}
      {(!gamepadName && isTypeGamepadTierRank(gamepadTierRank)) && (
        <TierRankBadge tierRank={gamepadTierRank}>
          {convertGamepadTierRankToDescription(gamepadTierRank)}
        </TierRankBadge>
      )}
      {(gamepadName && isTypeGamepadTierRank(gamepadTierRank)) && (
        <TierRankBadge tierRank={gamepadTierRank}>
          {`${gamepadName} - ${convertGamepadTierRankToDescription(gamepadTierRank)}`}
        </TierRankBadge>
      )}
    </RatingContainer>
  );
}

export default function FormRatingDisplay() {
  const { state: {
    ratingTierRankValue,
    frameRateTierRankValue,
    frameRateStuttersValue,
    gamepadName,
    gamepadTierRankValue,
  } } = usePerformancePostFormState();
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <RatingTierRankDisplay ratingTierRank={ratingTierRankValue} />
      <FrameRateTierRankDisplay
        frameRateTierRank={frameRateTierRankValue}
        frameRateStutters={frameRateStuttersValue}
        ratingTierRank={ratingTierRankValue}
      />
      <GamepadTierRankDisplay
        gamepadName={gamepadName}
        gamepadTierRank={gamepadTierRankValue}
      />
    </div>
  );
}
