import type { FrameRate, GamepadRating, RatingMedal } from '~/interfaces';
import AppRatingOverview from './AppRatingOverview';
import PerformancePostDisplay from './PerformancePostDisplay';

type PerformancePostLayoutProps =
{
  performancePosts: {
    id: string;
    postText: string;
    postTags: {
      postTagId: number;
      description: string;
    }[],
    gamepadMetadata: {
      gamepadId: number;
      description: string;
    } | null,
    gamepadRating: GamepadRating | null;
    createdAt: Date;
    ratingMedal: RatingMedal;
    frameRateAverage?: FrameRate | null;
    frameRateStutters?: boolean | null;
    displayName?: string | null;
    avatarMedium?: string | null;
    systemManufacturer?: string | null;
    systemModel?: string | null;
    systemOsVersion?: string | null;
    systemCpuBrand?: string | null;
    systemVideoDriver?: string | null;
    systemVideoDriverVersion?: string | null;
    systemVideoPrimaryVRAM?: string | null;
    systemMemoryRAM?: string | null;
  }[];
}

function PostLayoutCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 w-full
    bg-tertiary border-solid border-2 border-secondary
    p-3 rounded-lg"
    >
      {children}
    </div>
  );
}

export default function PerformancePostLayout({
  performancePosts,
}: PerformancePostLayoutProps) {
  if (performancePosts.length < 1) {
    return (
      <PostLayoutCard>
        There are currently no performance posts for this app. Use the form below to
        <strong className="font-semibold text-primary-highlight">
          {` `}become the first to submit!
        </strong>
      </PostLayoutCard>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <AppRatingOverview performancePosts={performancePosts} />
      <PostLayoutCard>
        <div className="flex flex-col gap-6 w-full">
          {performancePosts.map(({
            id,
            createdAt,
            displayName,
            avatarMedium,
            postText,
            postTags,
            gamepadMetadata,
            gamepadRating,
            ratingMedal,
            frameRateAverage,
            frameRateStutters,
            systemManufacturer,
            systemModel,
            systemOsVersion,
            systemCpuBrand,
            systemVideoDriver,
            systemVideoDriverVersion,
            systemVideoPrimaryVRAM,
            systemMemoryRAM,
          }, idx) => (
            <div key={id} id={id} className="flex flex-col gap-6">
              <PerformancePostDisplay
                createdAt={createdAt}
                displayName={displayName}
                postText={postText}
                postTags={postTags}
                gamepadMetadata={gamepadMetadata}
                gamepadRating={gamepadRating}
                ratingMedal={ratingMedal}
                frameRateAverage={frameRateAverage}
                frameRateStutters={frameRateStutters}
                avatarMedium={avatarMedium}
                systemManufacturer={systemManufacturer}
                systemModel={systemModel}
                systemOsVersion={systemOsVersion}
                systemCpuBrand={systemCpuBrand}
                systemVideoDriver={systemVideoDriver}
                systemVideoDriverVersion={systemVideoDriverVersion}
                systemVideoPrimaryVRAM={systemVideoPrimaryVRAM}
                systemMemoryRAM={systemMemoryRAM}
              />
              {(performancePosts.length - 1 > idx) &&
                <hr className="text-secondary" />
              }
            </div>
          ))}
        </div>
      </PostLayoutCard>
    </div>
  );
}
