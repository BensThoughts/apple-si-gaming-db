import type {
  PerformancePost,
} from '~/types';
import {
  convertFrameRateTierRankToDescription,
  convertGamepadTierRankToDescription,
  convertRatingTierRankToDescription,
} from '~/lib/conversions/rating-conversions';
import TierRankBadge from '~/components/TierRankBadge';
import TierRankPill from '~/components/TierRankPill';
import TextPill from '~/components/TextPill';
import { classNames } from '~/lib/css/classNames';

function RankItemContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={classNames(
          'flex gap-2 items-center min-w-fit flex-wrap',
          'lg:flex-col lg:gap-1 lg:justify-center lg:items-start',
      )}
    >
      {children}
    </div>
  );
}

type PerformancePostTierRankContainerProps = {
  rating: PerformancePost['rating'];
  postTags: PerformancePost['postTags']
}

export default function PerformancePostTierRankContainer({
  rating: {
    ratingTierRank,
    frameRateTierRank,
    frameRateStutters,
    gamepadMetadata,
    gamepadTierRank,
  },
  postTags,
}: PerformancePostTierRankContainerProps) {
  return (
    <div
      className={classNames(
          'flex flex-col gap-2 items-start justify-start flex-wrap',
          'rounded-sm w-full text-sm text-primary-faded',
          'lg:gap-4 lg:flex-row lg:items-center lg:justify-start',
      )}
    >
      <RankItemContainer>
        <span className="text-primary-faded italic font-light">
              Tier Rank
        </span>
        <TierRankBadge tierRank={ratingTierRank} className="text-primary">
          {`${convertRatingTierRankToDescription(ratingTierRank)}`}
        </TierRankBadge>
      </RankItemContainer>
      {(frameRateTierRank || frameRateStutters) &&
          <RankItemContainer>
            <span className="italic text-primary-faded font-light">
              Framerate
            </span>
            <div className="flex items-center gap-2">
              {frameRateTierRank &&
                  <TierRankBadge tierRank={frameRateTierRank} className="text-primary">
                    {convertFrameRateTierRankToDescription(frameRateTierRank)}
                  </TierRankBadge>
              }
              {frameRateStutters &&
                  <TierRankPill
                    tierRank={frameRateTierRank ? frameRateTierRank : ratingTierRank}
                    className="text-primary"
                  >
                    {`Stutters`}
                  </TierRankPill>
              }
            </div>
          </RankItemContainer>
      }
      {gamepadMetadata && gamepadTierRank &&
          <RankItemContainer>
            <span className="italic text-primary-faded font-light">
              Gamepad
            </span>
            <TierRankBadge tierRank={gamepadTierRank} className="text-primary">
              {`${gamepadMetadata.description} - ${convertGamepadTierRankToDescription(gamepadTierRank)}`}
            </TierRankBadge>
          </RankItemContainer>
      }
      {postTags.length > 0 &&
          <RankItemContainer>
            <span className="text-primary-faded italic font-light">
              Tags
            </span>
            <div className="flex gap-2 flex-wrap">
              {postTags.map((tag) => (
                <TextPill key={tag.id} className="text-primary">
                  {tag.description}
                </TextPill>
              ))}
            </div>
          </RankItemContainer>
      }
    </div>
  );
}
