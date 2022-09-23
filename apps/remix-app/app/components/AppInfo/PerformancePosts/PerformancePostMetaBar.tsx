import type { PerformancePost } from '~/interfaces/database';

interface PerformancePostMetaBarProps {
  createdAt: PerformancePost['createdAt'];
  ratingMedal: PerformancePost['ratingMedal'];
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
        {ratingMedal}
      </div>
    </div>
  );
}
