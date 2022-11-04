import type { FrameRate, RatingMedal } from '~/interfaces/database';
import { convertFrameRateToDescription, convertRatingMedalToDescription } from '~/lib/rating-conversions';

interface PerformancePostMetaBarProps {
  createdAt: Date;
  ratingMedal: RatingMedal;
  frameRateAverage?: FrameRate | null;
  frameRateStutters?: boolean | null;
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
          <span className="text-primary-highlight">
            {ratingMedal}
          </span>
          {` - `}
          {convertRatingMedalToDescription(ratingMedal)}
        </div>
        <div>
          {/* {(frameRateAverage || frameRateStutters) && <span>Frame Rate: </span>} */}
          {frameRateAverage &&
            <span className="text-primary-highlight">
              {convertFrameRateToDescription(frameRateAverage)}
            </span>}
          {frameRateStutters &&
            <span className="text-primary-highlight">
              {frameRateStutters ? ' [ Stutters ]' : null }
            </span>}
        </div>
      </div>
      <i className="italic">
        {createdAt.toDateString()}
      </i>
    </div>
  );
}
