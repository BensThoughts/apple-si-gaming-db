import type { FrameRate, RatingMedal } from '~/interfaces/database';
import GamepadPostDisplay from './GamepadPostDisplay';

type GamepadPostLayoutProps =
{
  gamepadPosts: {
    id: string;
    gamepad: {
      description: string,
    },
    postText: string;
    postTags: {
      postTagId: number;
      description: string;
    }[],
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

export default function GamepadPostLayout({
  gamepadPosts,
}: GamepadPostLayoutProps) {
  return (
    <div className={`grid grid-cols-1 w-full
                     bg-tertiary border-solid border-2 border-secondary
                     p-3 rounded-lg`}>
      {gamepadPosts.length > 0 ? (
        <div className="flex flex-col gap-6 w-full">
          {gamepadPosts.map(({
            id,
            gamepad,
            createdAt,
            displayName,
            avatarMedium,
            postText,
            postTags,
            ratingMedal,
            systemManufacturer,
            systemModel,
            systemOsVersion,
            systemCpuBrand,
            systemVideoDriver,
            systemVideoDriverVersion,
            systemVideoPrimaryVRAM,
            systemMemoryRAM,
          }, idx) => (
            <div key={id} className="flex flex-col gap-6">
              <GamepadPostDisplay
                createdAt={createdAt}
                gamepad={gamepad}
                displayName={displayName}
                postText={postText}
                postTags={postTags}
                ratingMedal={ratingMedal}
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
              {(gamepadPosts.length - 1 > idx) &&
                <hr className="text-secondary" />
              }
            </div>
          ))}
        </div>
      ): (
        <div>
          There are currently no controller posts for this app. Use the form below to
          <strong className="font-semibold text-primary-highlight">
            {` `}become the first to submit!
          </strong>
        </div>
      )}
    </div>
  );
}
