import TextPill from '~/components/TextPill';
import type { RatingMedal } from '~/interfaces/database';
import GamepadPostMetaBar from './GamepadPostMetaBar';
import SystemSpecsPopover from '~/components/AppInfo/PerformancePosts/SystemSpecsPopover';
// import { convertRatingMedalToNumber } from '~/interfaces/database';
// import { RatingMedalIcon } from '~/components/Icons';

type GamepadPostDisplayProps = {
  gamepad: {
    description: string;
  },
  postText: string;
  postTags: {
    postTagId: number;
    description: string;
  }[];
  createdAt: Date;
  ratingMedal: RatingMedal;
  avatarMedium?: string | null;
  displayName?: string | null;
  systemManufacturer?: string | null;
  systemModel?: string | null;
  systemOsVersion?: string | null;
  systemCpuBrand?: string | null;
  systemVideoDriver?: string | null;
  systemVideoDriverVersion?: string | null;
  systemVideoPrimaryVRAM?: string | null;
  systemMemoryRAM?: string | null;
} & React.HTMLAttributes<HTMLDivElement>

export default function GamepadPostDisplay({
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
  ...rest
}: GamepadPostDisplayProps) {
  // const ratingNum = convertRatingMedalToNumber(ratingMedal);
  return (
    <div className="flex flex-col w-full gap-3">
      <GamepadPostMetaBar
        createdAt={createdAt}
        ratingMedal={ratingMedal}
      />
      <div className="flex flex-row w-full gap-[1px]" {...rest}>
        <div className="flex flex-col gap-1 items-center justify-start pr-3 border-r-2 border-r-secondary md:w-full md:max-w-[10rem]">
          {avatarMedium && (
            <div>
              <img
                src={avatarMedium}
                alt="avatar"
                width={64}
                height={64}
                onError={(e) => {
                  e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
                }}
              />
            </div>
          )}
          {displayName && <span className="text-sm">{displayName}</span>}
          {/* // ! Below Added to allow for no system specs on a post */}
          {(
            systemManufacturer ||
            systemModel ||
            systemOsVersion ||
            systemCpuBrand ||
            systemVideoDriver ||
            systemVideoDriverVersion ||
            systemVideoPrimaryVRAM ||
            systemMemoryRAM
          ) &&
            <SystemSpecsPopover
              systemManufacturer={systemManufacturer}
              systemModel={systemModel}
              systemOsVersion={systemOsVersion}
              systemCpuBrand={systemCpuBrand}
              systemVideoDriver={systemVideoDriver}
              systemVideoDriverVersion={systemVideoDriverVersion}
              systemVideoPrimaryVRAM={systemVideoPrimaryVRAM}
              systemMemoryRAM={systemMemoryRAM}
            >
              <span className="underline underline-offset-4 hover:text-icon-secondary
                               transition-colors duration-200 text-sm">
                System
              </span>
            </SystemSpecsPopover>
          }
          {postTags.length > 0 &&
            <div className="md:hidden flex flex-col whitespace-nowrap gap-1 w-full justify-start">
              {postTags.map((tag) => (
                <div key={tag.postTagId}>
                  <TextPill className="hover:bg-tertiary-highlight">{tag.description}</TextPill>
                </div>
              ))}
            </div>}
        </div>
        <div className="w-full flex flex-col gap-2 h-full border-l-1 border-l-secondary-highlight pl-3">
          <div className="hidden md:flex flex-row flex-wrap gap-1 w-full justify-start">
            <div>
              <TextPill className="hover:bg-tertiary-highlight">{gamepad.description}</TextPill>
            </div>
            {postTags.length > 0 &&
              <>
                {postTags.map((tag) => (
                  <div key={tag.postTagId}>
                    <TextPill className="hover:bg-tertiary-highlight">{tag.description}</TextPill>
                  </div>
                ))}
              </>
            }
          </div>
          <div>
            {postText}
          </div>
          {/* {Array(ratingNum).fill(<RatingMedalIcon />)} */}
        </div>
      </div>
    </div>
  );
}
