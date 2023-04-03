import TextPill from '~/components/TextPill';
import PerformancePostMetaBar from './PerformancePostMetaBar';
import SystemSpecsPopover from './SystemSpecsPopover';
import { convertGamepadTierRankToDescription } from '~/lib/conversions/rating-conversions';
import AvatarImage from '~/components/ImageWrappers/AvatarImage';
import type {
  PerformancePost,
} from '~/interfaces';

type PerformancePostDisplayProps = {
  performancePost: PerformancePost;
}

export default function PerformancePostDisplay({
  performancePost,
}: PerformancePostDisplayProps) {
  const {
    performancePostId,
    createdAt,
    postText,
    userWhoCreated: {
      steamUserId64,
      avatarMedium,
      displayName,
    },
    rating: {
      ratingTierRank,
      frameRateTierRank,
      frameRateStutters,
      gamepadTierRank,
      gamepadMetadata,
    },
    numLikes,
    systemSpec: {
      manufacturer,
      model,
      osVersion,
      cpuBrand,
      videoDriver,
      videoDriverVersion,
      videoPrimaryVRAM,
      memoryRAM,
    },
    postTags,
    steamApp: {
      steamAppId,
    },
  } = performancePost;
  return (
    <div className="flex flex-col w-full gap-3">
      <PerformancePostMetaBar
        performancePostMetadata={{
          performancePostId,
          createdAt,
          userWhoCreated: { steamUserId64 },
          steamApp: { steamAppId },
          rating: {
            ratingTierRank,
            frameRateTierRank,
            frameRateStutters,
          },
          numLikes,
        }}
      />
      <div className="flex flex-row w-full gap-[1px]">
        <div className="flex flex-col gap-2 items-center justify-start
                        pr-3 border-r-2 border-r-secondary md:w-full md:max-w-[10rem]">
          <div className="flex flex-col gap-1 items-center w-full">
            {avatarMedium && (
              <div>
                <AvatarImage avatarMedium={avatarMedium} />
              </div>
            )}
            {displayName && (
              <span className="text-sm">{displayName}</span>
            )}
          </div>

          {/* // ! Below Added to allow for no system specs on a post */}
          {(
            manufacturer ||
            model ||
            osVersion ||
            cpuBrand ||
            videoDriver ||
            videoDriverVersion ||
            videoPrimaryVRAM ||
            memoryRAM
          ) &&
            <SystemSpecsPopover
              systemSpec={{
                manufacturer,
                model,
                osVersion,
                cpuBrand,
                videoDriver,
                videoDriverVersion,
                videoPrimaryVRAM,
                memoryRAM,
              }}
            >
              <div className="underline underline-offset-4 hover:text-tertiary
                              transition-colors duration-200 text-sm
                              pb-2">
                System
              </div>
            </SystemSpecsPopover>
          }
          {/* Gamepad and Post Tags Small Screens Only */}
          {(postTags.length > 0 || gamepadMetadata) &&
            <div className="md:hidden flex flex-col whitespace-nowrap gap-1 w-full justify-start">
              {(gamepadMetadata && gamepadTierRank) &&
                <div>
                  <TextPill className="bg-primary hover:bg-primary-highlight">
                    {`${gamepadMetadata.description}`}
                  </TextPill>
                </div>
              }
              {postTags.map((tag) => (
                <div key={tag.id}>
                  <TextPill className="hover:bg-tertiary-highlight">
                    {tag.description}
                  </TextPill>
                </div>
              ))}
            </div>
          }
        </div>
        <div className="w-full flex flex-col gap-2 h-full pl-3">
          {/* Gamepad and Post Tags Medium Screens Only */}
          {(postTags.length > 0 || gamepadMetadata) &&
            <div className="hidden md:flex flex-row flex-wrap gap-1 w-full justify-start">
              {(gamepadMetadata && gamepadTierRank) &&
                <div>
                  <TextPill className="bg-primary hover:bg-primary-highlight">
                    {`${gamepadMetadata.description} - ${convertGamepadTierRankToDescription(gamepadTierRank)}`}
                  </TextPill>
                </div>
              }
              {postTags.map((tag) => (
                <div key={tag.id}>
                  <TextPill className="hover:bg-tertiary-highlight">{tag.description}</TextPill>
                </div>
              ))}
            </div>
          }
          <div>
            {postText}
          </div>
        </div>
      </div>
    </div>
  );
}
