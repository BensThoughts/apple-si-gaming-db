import type { FrameRate, RatingMedal } from '~/interfaces/database';

interface PerformancePostMetaBarProps {
  createdAt: Date;
  ratingMedal: RatingMedal;
  frameRateAverage?: FrameRate | null;
  frameRateStutters?: boolean | null;
}

function getRatingMedalText(ratingMedal: RatingMedal) {
  switch (ratingMedal) {
    case 'Platinum':
      return 'Runs [ perfect ]';
    case 'Gold':
      return 'Runs [ perfect after tweaks ]';
    case 'Silver':
      return 'Runs [ with minor issues ]';
    case 'Bronze':
      return 'Runs [ often crashes ]';
    case 'Borked':
      return `Doesn't Run`;
  }
}

function getFrameRateText(frameRateAverage: FrameRate) {
  switch (frameRateAverage) {
    case 'VeryLow':
      return '<25 FPS';
    case 'Low':
      return '25 - 40 FPS';
    case 'Medium':
      return '40 - 60 FPS';
    case 'High':
      return '60 - 120 FPS';
    case 'VeryHigh':
      return '120+ FPS';
  }
}

export default function PerformancePostMetaBar({
  createdAt,
  ratingMedal,
  frameRateAverage,
  frameRateStutters,
}: PerformancePostMetaBarProps) {
  return (
    <div className="flex flex-col gap-1 md:gap-0 md:flex-row items-start md:items-center justify-between text-sm px-3 py-1 rounded-sm bg-primary w-full text-primary-faded">
      <div className="flex flex-col gap-1 md:flex-row md:gap-2">
        <div>
          <span className="text-primary-highlight">{ratingMedal}</span> - {getRatingMedalText(ratingMedal)}
        </div>
        <div>
          {/* {(frameRateAverage || frameRateStutters) && <span>Frame Rate: </span>} */}
          {frameRateAverage && <span className="text-primary-highlight">{getFrameRateText(frameRateAverage)}</span>}
          {frameRateStutters && <span className="text-primary-highlight">{frameRateStutters ? ' [ Stutters ]' : null }</span>}
        </div>
      </div>
      <i className="italic">
        {createdAt.toDateString()}
      </i>
    </div>
  );
}
