import { classNames } from '~/lib/css/classNames';
import type { TierRank } from '~/types';
import { convertTierRankToName } from '~/lib/conversions/rating-conversions';

export default function TierRankBadge({
  tierRank,
  children,
  backgroundColor,
  includeRatingLetter = true,
}: {
  children: string,
  backgroundColor?: 'primary-highlight',
  tierRank: TierRank;
  includeRatingLetter?: boolean;
}) {
  const getTierRankColorCSS = (tierRank: TierRank) => {
    switch (tierRank) {
      case 'FTier':
        return classNames(
            `border-tier-rank-f after:bg-tier-rank-f after:border-l-tier-rank-f`,
            includeRatingLetter ? `after:content-['F']` : ``,
        );
      case 'ETier':
        return classNames(
            `border-tier-rank-e after:bg-tier-rank-e after:border-l-tier-rank-e`,
            includeRatingLetter ? `after:content-['E']` : ``,
        );
      case 'DTier':
        return classNames(
            `border-tier-rank-d after:bg-tier-rank-d after:border-l-tier-rank-d`,
            includeRatingLetter ? `after:content-['D']` : ``,
        );
      case 'CTier':
        return classNames(
            `border-tier-rank-c after:bg-tier-rank-c after:border-l-tier-rank-c`,
            includeRatingLetter ? `after:content-['C']` : ``,
        );
      case 'BTier':
        return classNames(
            `border-tier-rank-b after:bg-tier-rank-b after:border-l-tier-rank-b`,
            includeRatingLetter ? `after:content-['B']` : ``,
        );
      case 'ATier':
        return classNames(
            `border-tier-rank-a after:bg-tier-rank-a after:border-l-tier-rank-a`,
            includeRatingLetter ? `after:content-['A']` : ``,
        );
      case 'STier':
        return classNames(
            `border-tier-rank-s after:bg-tier-rank-s after:border-l-tier-rank-s`,
            includeRatingLetter ? `after:content-['S']` : ``,
        );
      default:
        return classNames(
            `border-tier-rank-s after:bg-tier-rank-s after:border-l-tier-rank-s`,
            includeRatingLetter ? `after:content-['S']` : ``,
        );
    }
  };
  const tierRankColorCSS = getTierRankColorCSS(tierRank);
  return (
    <div
      className={classNames(
          `relative flex justify-center items-center select-none w-full max-w-fit h-6 px-2 py-1`,
          `rounded-md border-1 relative after:absolute after:flex after:items-center`,
          `after:justify-center after:w-8 after:h-6 after:left-0 after:rounded-l-md`,
          `after:border-l-1 after:text-black after:font-medium`,
          `after:text-sm shadow-md z-0 after:z-0`,
          tierRankColorCSS,
          (backgroundColor === 'primary-highlight' ? 'bg-primary-highlight' : ''),
      )}
      aria-label={`${convertTierRankToName} tier`}
    >
      <span className="ml-8 text-xs text-primary">
        {children}
      </span>
    </div>
  );
};
