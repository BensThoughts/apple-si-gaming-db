import LikeButton from '~/components/LikeButton';
import type { FrameRate, RatingMedal } from '~/interfaces';
import { convertFrameRateToDescription, convertRatingMedalToDescription } from '~/lib/rating-conversions';

interface PerformancePostMetaBarProps {
  createdAt: Date;
  ratingMedal: RatingMedal;
  frameRateAverage?: FrameRate | null;
  frameRateStutters?: boolean | null;
  likeButtonData: {
    numLikes: number;
    postId: string;
    isUserLoggedIn: boolean;
    hasLoggedInUserLiked: boolean;
  }
}

export default function PerformancePostMetaBar({
  createdAt,
  ratingMedal,
  frameRateAverage,
  frameRateStutters,
  likeButtonData,
}: PerformancePostMetaBarProps) {
  const {
    postId,
    isUserLoggedIn,
    hasLoggedInUserLiked,
    numLikes,
  } = likeButtonData;
  return (
    <div className="@container">
      <div className="flex flex-col gap-1 items-start justify-between text-sm px-3 py-1
                      rounded-sm bg-primary w-full text-primary-faded
                      @[600px]:gap-0 @[600px]:flex-row @[600px]:items-center
                      supports-[not(container-type:inline-size)]:postMetaBarQuery:gap-0
                      supports-[not(container-type:inline-size)]:postMetaBarQuery:flex-row
                      supports-[not(container-type:inline-size)]:postMetaBarQuery:items-center"
      >
        <div className="flex flex-col gap-2 items-start justify-center
                        @[600px]:items-center @[600px]:flex-row @[600px]:gap-3
                        supports-[not(container-type:inline-size)]:postMetaBarQuery:gap-3
                        supports-[not(container-type:inline-size)]:postMetaBarQuery:flex-row
                        supports-[not(container-type:inline-size)]:postMetaBarQuery:items-center"
        >
          {/* <Form
            method="post"
            action="/actions/like-post"
          > */}
          <LikeButton
            postId={postId}
            numLikes={numLikes}
            isUserLoggedIn={isUserLoggedIn}
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
        </div>

        <i className="italic">
          {createdAt.toDateString()}
        </i>
      </div>
    </div>

  );
}
