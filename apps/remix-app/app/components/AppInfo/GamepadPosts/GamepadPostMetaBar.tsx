import type { RatingMedal } from '~/interfaces/database';

interface GamepadPostMetaBarProps {
  createdAt: Date;
  ratingMedal: RatingMedal;
}

function getRatingMedalText(ratingMedal: RatingMedal) {
  switch (ratingMedal) {
    case 'Platinum':
      return 'Works [ perfect ]';
    case 'Gold':
      return 'Works [ perfect after tweaks ]';
    case 'Silver':
      return 'Works [ with minor issues ]';
    case 'Bronze':
      return 'Works [ with major issues ]';
    case 'Borked':
      return `Doesn't Work`;
  }
}

export default function GamepadPostMetaBar({
  createdAt,
  ratingMedal,
}: GamepadPostMetaBarProps) {
  return (
    <div className="flex flex-col gap-1 md:gap-0 md:flex-row items-start md:items-center justify-between text-sm px-3 py-1 rounded-sm bg-primary w-full text-primary-faded">
      <div className="flex flex-col gap-1 md:flex-row md:gap-2">
        <div>
          <span className="text-primary-highlight">{ratingMedal}</span> - {getRatingMedalText(ratingMedal)}
        </div>
      </div>
      <i className="italic">
        {createdAt.toDateString()}
      </i>
    </div>
  );
}
