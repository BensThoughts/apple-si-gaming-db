import TextPill from '~/components/TextPill';
import PerformancePostMetaBar from './PerformancePostMetaBar';
import SystemSpecsPopover from './SystemSpecsPopover';
import { convertGamepadRatingToDescription } from '~/lib/conversions/rating-conversions';
import AvatarImage from '~/components/ImageWrappers/AvatarImage';
import type {
  PerformancePostBase,
  PerformancePostRating,
  PerformancePostSteamApp,
  PerformancePostSystem,
  PerformancePostUserWhoCreated,
  PerformancePostTag,
  PerformancePostLikes,
} from '~/interfaces';

type PerformancePostDisplayProps = {
  performancePost: PerformancePostBase & {
    steamApp: PerformancePostSteamApp;
    rating: PerformancePostRating;
    likes: PerformancePostLikes;
    system: PerformancePostSystem;
    userWhoCreatedPost: PerformancePostUserWhoCreated;
    postTags: PerformancePostTag[];
  };
} & React.HTMLAttributes<HTMLDivElement>

export default function PerformancePostDisplay({
  performancePost,
  ...rest
}: PerformancePostDisplayProps) {
  const {
    performancePostId,
    createdAt,
    postText,
    userWhoCreatedPost: {
      steamUserId64,
      avatarMedium,
      displayName,
    },
    rating: {
      ratingMedal,
      frameRateAverage,
      frameRateStutters,
      gamepadRating,
      gamepadMetadata,
    },
    likes: {
      numLikes,
    },
    system,
    postTags,
    steamApp: {
      steamAppId,
    },
  } = performancePost;
  return (
    <div className="flex flex-col w-full gap-3">
      <PerformancePostMetaBar
        performancePostId={performancePostId}
        createdAt={createdAt}
        userWhoCreatedPost={{ steamUserId64 }}
        steamApp={{ steamAppId }}
        rating={{ ratingMedal, frameRateAverage, frameRateStutters }}
        likeButtonData={{
          numLikes,
        }}
      />
      <div className="flex flex-row w-full gap-[1px]" {...rest}>
        <div className="flex flex-col gap-1 items-center justify-start pr-3 border-r-2 border-r-secondary md:w-full md:max-w-[10rem]">
          {avatarMedium && (
            <div>
              <AvatarImage avatarMedium={avatarMedium} />
            </div>
          )}
          {displayName && (
            <span className="text-sm">{displayName}</span>
          )}
          {/* // ! Below Added to allow for no system specs on a post */}
          {(
            system.manufacturer ||
            system.model ||
            system.osVersion ||
            system.cpuBrand ||
            system.videoDriver ||
            system.videoDriverVersion ||
            system.videoPrimaryVRAM ||
            system.memoryRAM
          ) &&
            <SystemSpecsPopover
              systemManufacturer={system.manufacturer}
              systemModel={system.model}
              systemOsVersion={system.osVersion}
              systemCpuBrand={system.cpuBrand}
              systemVideoDriver={system.videoDriver}
              systemVideoDriverVersion={system.videoDriverVersion}
              systemVideoPrimaryVRAM={system.videoPrimaryVRAM}
              systemMemoryRAM={system.memoryRAM}
            >
              <span className="underline underline-offset-4 hover:text-icon-secondary
                               transition-colors duration-200 text-sm">
                System
              </span>
            </SystemSpecsPopover>
          }
          {/* Gamepad and Post Tags Small Screens Only */}
          {(postTags.length > 0 || gamepadMetadata) &&
            <div className="md:hidden flex flex-col whitespace-nowrap gap-1 w-full justify-start">
              {(gamepadMetadata && gamepadRating) &&
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
        <div className="w-full flex flex-col gap-2 h-full border-l-1 border-l-secondary-highlight pl-3">
          {/* Gamepad and Post Tags Medium Screens Only */}
          {(postTags.length > 0 || gamepadMetadata) &&
            <div className="hidden md:flex flex-row flex-wrap gap-1 w-full justify-start">
              {(gamepadMetadata && gamepadRating) &&
                <div>
                  <TextPill className="bg-primary hover:bg-primary-highlight">
                    {`${gamepadMetadata.description} - ${convertGamepadRatingToDescription(gamepadRating)}`}
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
          {/* {Array(ratingNum).fill(<RatingMedalIcon />)} */}
        </div>
      </div>
    </div>
  );
}
