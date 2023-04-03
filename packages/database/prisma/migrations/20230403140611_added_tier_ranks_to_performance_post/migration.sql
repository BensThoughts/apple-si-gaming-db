-- AlterTable
ALTER TABLE "PerformancePost" ADD COLUMN     "frameRateTierRank" "TierRank",
ADD COLUMN     "gamepadTierRank" "TierRank",
ADD COLUMN     "ratingTierRank" "TierRank" NOT NULL DEFAULT 'STier';
