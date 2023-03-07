import LikeButton from '~/components/LikeButton';
import type {
  PerformancePost,
} from '~/interfaces';
import { convertFrameRateToDescription, convertRatingMedalToDescription } from '~/lib/conversions/rating-conversions';
import { useUserSession } from '~/lib/hooks/useMatchesData';
import EditAndDeleteButtons from './EditAndDeleteButtons';

type PerformancePostMetaBarProps = Pick<PerformancePost, 'performancePostId' | 'createdAt' | 'numLikes'> & {
  steamApp: Pick<PerformancePost['steamApp'], 'steamAppId'>;
  userWhoCreated: Pick<PerformancePost['userWhoCreated'], 'steamUserId64'>;
  rating: Pick<PerformancePost['rating'], 'ratingMedal' | 'frameRateAverage' | 'frameRateStutters'>;
}

export default function PerformancePostMetaBar({
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
}: PerformancePostMetaBarProps) {
  const { steamUserProfile } = useUserSession();

  const didSteamUserCreatePost = steamUserProfile
    ? userWhoCreated.steamUserId64 === steamUserProfile.steamUserId64
    : false;

  return (
    <div className="@container">
      <div className="flex flex-col gap-1 items-start justify-between text-sm px-3 py-1
                      rounded-sm bg-primary w-full text-primary-faded
                      @[650px]:gap-0 @[650px]:flex-row @[650px]:items-center
                      supports-[not(container-type:inline-size)]:postMetaBarQuery:gap-0
                      supports-[not(container-type:inline-size)]:postMetaBarQuery:flex-row
                      supports-[not(container-type:inline-size)]:postMetaBarQuery:items-center"
      >
        <div className="flex flex-col gap-2 items-start justify-center
                        @[650px]:items-center @[650px]:flex-row @[650px]:gap-3
                        supports-[not(container-type:inline-size)]:postMetaBarQuery:gap-3
                        supports-[not(container-type:inline-size)]:postMetaBarQuery:flex-row
                        supports-[not(container-type:inline-size)]:postMetaBarQuery:items-center"
        >
          {/* <Form
            method="post"
            action="/actions/like-post"
          > */}
          <LikeButton
            performancePostId={performancePostId}
            numLikes={numLikes}
          />
          {/* </Form> */}
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
          {didSteamUserCreatePost && (
            <EditAndDeleteButtons
              steamAppId={steamAppId}
              performancePostId={performancePostId}
            />
          )}
        </div>

        <i className="italic">
          {createdAt.toDateString()}
        </i>
      </div>
    </div>

  );
}
