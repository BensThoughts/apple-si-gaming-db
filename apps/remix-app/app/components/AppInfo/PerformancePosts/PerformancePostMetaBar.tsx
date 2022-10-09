import type { RatingMedal } from '~/interfaces/database';

interface PerformancePostMetaBarProps {
  createdAt: Date;
  ratingMedal: RatingMedal;
}

function getRatingMedalText(ratingMedal: RatingMedal) {
  switch (ratingMedal) {
    case 'Platinum':
      return 'Runs [ perfect ] - Platinum';
    case 'Gold':
      return 'Runs [ perfect after tweaks ] - Gold';
    case 'Silver':
      return 'Runs [ with minor issues ] - Silver';
    case 'Bronze':
      return 'Runs [ often crashes ] - Bronze';
    case 'Borked':
      return `Doesn't Run - Borked`;
  }
}

export default function PerformancePostMetaBar({
  createdAt,
  ratingMedal,
}: PerformancePostMetaBarProps) {
  return (
    <div className="flex items-center justify-between bg-primary w-full text-primary-faded text-sm px-3 py-1 rounded-sm">
      <i className="italic">
        {createdAt.toDateString()}
      </i>
      <div>
        {getRatingMedalText(ratingMedal)}
      </div>
    </div>
  );
}
