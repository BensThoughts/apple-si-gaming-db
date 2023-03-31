import { useMatches } from '@remix-run/react';
import LikeButton from '~/components/LikeButton';
import type {
  PerformancePostMetaBarData,
} from '~/interfaces';
import { convertFrameRateToDescription, convertRatingMedalToDescription } from '~/lib/conversions/rating-conversions';
import { useUserSession } from '~/lib/hooks/useMatchesData';
// import EditAndDeleteButtons from './EditAndDeleteButtons';
import EditButton from './EditButton';

type PerformancePostMetaBarProps = {
  performancePostMetadata: PerformancePostMetaBarData;
}

export default function PerformancePostMetaBar({
  performancePostMetadata: {
    performancePostId,
    createdAt,
    userWhoCreated,
    steamApp: {
      steamAppId,
    },
    rating: {
      ratingMedal,
      frameRateAverage,
      frameRateStutters,
    },
    numLikes,
  },
}: PerformancePostMetaBarProps) {
  const { userSession } = useUserSession();
  const matches = useMatches();
  const deepestMatch = matches.length > 0
    ? matches[matches.length - 1]
    : undefined;
  const currentlyOnEditPage =
    deepestMatch && deepestMatch.id === 'routes/apps/$steamAppId/posts.edit.$performancePostId'
      ? true
      : false;
  const redirectToAfterEdit = deepestMatch && `${deepestMatch.pathname}#${performancePostId}`;

  const didSteamUserCreatePost = userSession
    ? userWhoCreated.steamUserId64 === userSession.steamUserProfile.steamUserId64
    : false;

  return (
    <div className="@container">
      <div className="flex flex-col gap-1 items-start justify-between px-3 py-2
                      rounded-sm bg-primary w-full text-sm text-primary-faded
                      @[706px]:gap-0 @[706px]:flex-row @[706px]:items-center
                      supports-[not(container-type:inline-size)]:postMetaBarQuery:gap-0
                      supports-[not(container-type:inline-size)]:postMetaBarQuery:flex-row
                      supports-[not(container-type:inline-size)]:postMetaBarQuery:items-center"
      >
        <div className="flex flex-col gap-2 items-start justify-start w-full
                        @[650px]:items-center @[650px]:flex-row @[650px]:gap-3 @[650px]:w-fit
                        supports-[not(container-type:inline-size)]:postMetaBarQuery:w-fit
                        supports-[not(container-type:inline-size)]:postMetaBarQuery:gap-3
                        supports-[not(container-type:inline-size)]:postMetaBarQuery:flex-row
                        supports-[not(container-type:inline-size)]:postMetaBarQuery:items-center"
        >
          <div
            className="flex gap-2 justify-between items-center w-full @[650px]:w-fit
                       supports-[not(container-type:inline-size)]:postMetaBarQuery:w-fit"
          >
            <LikeButton
              performancePostId={performancePostId}
              numLikes={numLikes}
            />
            {(didSteamUserCreatePost && !currentlyOnEditPage) && (
              <div
                className="block @[650px]:hidden
                    supports-[not(container-type:inline-size)]:postMetaBarQuery:hidden"
              >
                <EditButton
                  steamAppId={steamAppId}
                  performancePostId={performancePostId}
                  redirectToAfterEdit={redirectToAfterEdit}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 md:flex-row md:gap-2">
            <div>
              <span className="text-primary-highlight text-base leading-4">
                {ratingMedal}
              </span>
              <span>
                {` - `}
                {convertRatingMedalToDescription(ratingMedal)}
              </span>
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
          {(didSteamUserCreatePost && !currentlyOnEditPage) && (
            <span
              className="hidden @[650px]:inline
                         supports-[not(container-type:inline-size)]:postMetaBarQuery:hidden"
            >
              <EditButton
                steamAppId={steamAppId}
                performancePostId={performancePostId}
                redirectToAfterEdit={redirectToAfterEdit}
              />
            </span>
          )}
        </div>

        <i className="italic">
          {createdAt.toDateString()}
        </i>
      </div>
    </div>

  );
}
