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
import { initialGamepadOption } from './FormContext/initialFormOptions';

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
      {isTypeRatingTierRank(ratingTierRank) ? (
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
      {isTypeFrameRateTierRank(frameRateTierRank) || frameRateStutters ? (
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
  gamepadName: string;
  gamepadTierRank: GamepadTierRankOption['value'];
}) {
  const gamepadNoneOptionName = initialGamepadOption.name;
  return (
    <RatingContainer title="Gamepad">
      {(
        (gamepadName === gamepadNoneOptionName) &&
        !isTypeGamepadTierRank(gamepadTierRank)
      ) && (
        <TextPill>None Given</TextPill>
      )}
      {(
        (gamepadName != gamepadNoneOptionName) &&
        !isTypeGamepadTierRank(gamepadTierRank)
      ) && (
        <TierRankBadge includeRatingLetter={false} tierRank="STier">
          {gamepadName}
        </TierRankBadge>
      )}
      {(
        (gamepadName === gamepadNoneOptionName) &&
        isTypeGamepadTierRank(gamepadTierRank)
      ) && (
        <TierRankBadge tierRank={gamepadTierRank}>
          {convertGamepadTierRankToDescription(gamepadTierRank)}
        </TierRankBadge>
      )}
      {(
        (gamepadName != gamepadNoneOptionName) &&
        isTypeGamepadTierRank(gamepadTierRank)
      ) && (
        <TierRankBadge tierRank={gamepadTierRank}>
          {`${gamepadName} - ${convertGamepadTierRankToDescription(gamepadTierRank)}`}
        </TierRankBadge>
      )}
    </RatingContainer>
  );
}

export default function FormRatingDisplay() {
  const { state: {
    ratingTierRankSelectedOption,
    frameRateTierRankSelectedOption,
    frameRateStuttersValue,
    gamepadSelectedOption,
    gamepadTierRankSelectedOption,
  } } = usePerformancePostFormState();
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <RatingTierRankDisplay ratingTierRank={ratingTierRankSelectedOption.value} />
      <FrameRateTierRankDisplay
        frameRateTierRank={frameRateTierRankSelectedOption.value}
        frameRateStutters={frameRateStuttersValue}
        ratingTierRank={ratingTierRankSelectedOption.value}
      />
      <GamepadTierRankDisplay
        gamepadName={gamepadSelectedOption.name}
        gamepadTierRank={gamepadTierRankSelectedOption.value}
      />
    </div>
  );
}
