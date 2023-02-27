import LikeButton from '~/components/LikeButton';
import type { FrameRate, RatingMedal } from '~/interfaces';
import { convertFrameRateToDescription, convertRatingMedalToDescription } from '~/lib/conversions/rating-conversions';
import EditAndDeleteButtons from './EditAndDeleteButtons';

interface PerformancePostMetaBarProps {
  steamAppId: number;
  performancePostId: string;
  createdAt: Date;
  ratingMedal: RatingMedal;
  frameRateAverage?: FrameRate | null;
  frameRateStutters?: boolean | null;
  userSession: {
    isUserLoggedIn: boolean;
    didLoggedInUserCreatePost: boolean;
  };
  likeButtonData: {
    numLikes: number;
    hasLoggedInUserLiked: boolean;
  }
}

export default function PerformancePostMetaBar({
  steamAppId,
  performancePostId,
  createdAt,
  userSession = { isUserLoggedIn: false, didLoggedInUserCreatePost: false },
  ratingMedal,
  frameRateAverage,
  frameRateStutters,
  likeButtonData,
}: PerformancePostMetaBarProps) {
  const {
    hasLoggedInUserLiked,
    numLikes,
  } = likeButtonData;
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
            postId={performancePostId}
            numLikes={numLikes}
            isUserLoggedIn={userSession.isUserLoggedIn}
            hasLoggedInUserLiked={hasLoggedInUserLiked}
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
          {userSession.didLoggedInUserCreatePost && (
            <EditAndDeleteButtons
              steamAppId={steamAppId}
              postId={performancePostId}
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
