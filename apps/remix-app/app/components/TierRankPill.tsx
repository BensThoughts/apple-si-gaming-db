import { classNames } from '~/lib/css/classNames';
import type { TierRank } from '~/types';

export default function TierRankPill({
  tierRank,
  children,
  className,
}: {
  children: string,
  className?: string,
  tierRank: TierRank;
}) {
  const getTierRankColorCSS = (tierRank: TierRank) => {
    switch (tierRank) {
      case 'FTier':
        return `border-tier-rank-f`;

      case 'ETier':
        return `border-tier-rank-e`;
      case 'DTier':
        return `border-tier-rank-d`;
      case 'CTier':
        return `border-tier-rank-c`;
      case 'BTier':
        return `border-tier-rank-b`;
      case 'ATier':
        return `border-tier-rank-a`;
      case 'STier':
        return `border-tier-rank-s`;
      default:
        return `border-tier-rank-s`;
    }
  };
  const tierRankColorCSS = getTierRankColorCSS(tierRank);
  return (
    <div className={classNames(
        `flex justify-center items-center select-none w-full max-w-fit h-6 px-2 py-1 text-xs`,
        `rounded-md border-1 shadow-md`,
        tierRankColorCSS,
        className ? className : '',
    )}
    >
      {children}
    </div>
  );
};
