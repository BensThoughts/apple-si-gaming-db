import TextPill from '~/components/TextPill';
import TierRankBadge from '~/components/TierRankBadge';
import TierRankPill from '~/components/TierRankPill';
import { convertFrameRateTierRankToDescription, convertGamepadTierRankToDescription, convertRatingTierRankToDescription } from '~/lib/conversions/rating-conversions';
import type { FrameRateTierRank, GamepadTierRank, PerformancePost, RatingTierRank } from '~/types';

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

export default function FormRatingDisplay({
  ratingTierRank,
  frameRateTierRank,
  frameRateStutters,
  gamepadMetadata,
  gamepadTierRank,
  postTags,
}: {
  ratingTierRank?: PerformancePost['rating']['ratingTierRank'];
  frameRateTierRank: PerformancePost['rating']['frameRateTierRank'];
  frameRateStutters: PerformancePost['rating']['frameRateStutters'],
  gamepadMetadata: PerformancePost['rating']['gamepadMetadata'];
  gamepadTierRank: PerformancePost['rating']['gamepadTierRank'];
  postTags: PerformancePost['postTags'];
}) {
  return (
    <div className="flex items-center gap-2">
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
      <RatingContainer title="Gamepad">
        {gamepadTierRank && gamepadMetadata ? (
          <TierRankBadge tierRank={gamepadTierRank}>
            {`${gamepadMetadata.description} - ${convertGamepadTierRankToDescription(gamepadTierRank)}`}
          </TierRankBadge>
        ) : (
          <TextPill>
            None Given
          </TextPill>
        )}
      </RatingContainer>
      <RatingContainer title="Tags">
        {postTags.length > 1 ? (
          <>
            {postTags.map((tag) => (
              <TextPill key={tag.id}>
                {tag.description}
              </TextPill>
            ))}
          </>
        ) : (
          <TextPill>None Given</TextPill>
        )}
      </RatingContainer>
    </div>
  );
}
