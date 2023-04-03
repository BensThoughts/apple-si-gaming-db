import { classNames } from '~/lib/css/classNames';
import type { TierRank } from '~/interfaces';

export default function TierRankBadge({
  tierRank,
  children,
  className,
  includeRatingLetter = true,
}: {
  children: string,
  className?: string,
  tierRank?: TierRank | null;
  includeRatingLetter?: boolean;
}) {
  const getTierRankColorCSS = (tierRank?: TierRank | null) => {
    switch (tierRank) {
      case undefined:
        return classNames(
            `border-tier-rank-f after:bg-tier-rank-f after:border-l-tier-rank-f`,
          includeRatingLetter ? `after:content-['F']` : ``,
        );
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
    <div className={classNames(
        `flex justify-center items-center select-none w-full max-w-fit h-6 px-2 py-1 text-xs`,
        `rounded-md border-1 relative z-10 after:absolute after:flex after:items-center`,
        `after:justify-center after:w-8 after:h-6 after:left-0 after:rounded-l-md after:z-20`,
        `after:border-l-1 bg-primary-highlight after:text-black after:font-medium`,
        `after:text-sm`,
        tierRankColorCSS,
        className ? className : '',
    )}
    >
      <span className="ml-8 relative inset-0 z-30 bg-primary-highlight">
        {children}
      </span>
    </div>
  );
};
