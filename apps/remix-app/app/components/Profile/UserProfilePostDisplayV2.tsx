import { Link } from '@remix-run/react';
import type { PerformancePostForUserProfileDisplay } from '~/interfaces';
import {
  convertFrameRateTierRankToDescription,
  convertGamepadTierRankToDescription,
  convertRatingTierRankToDescription,
} from '~/lib/conversions/rating-conversions';
import EditButton from '~/components/Buttons/EditButton';
import AppHeaderImage from '../ImageWrappers/AppHeaderImage';
import LikeButton from '~/components/Buttons/LikeButton';
import { useUserSession } from '~/lib/hooks/useMatchesData';
import TextPill from '~/components/TextPill';
import TailwindDisclosure from '~/components/HeadlessComponents/TailwindDisclosure';
import TierRankBadge from '~/components/TierRankBadge';


export default function UserProfilePostDisplayV2({
  performancePost,
}: {
  performancePost: PerformancePostForUserProfileDisplay;
}) {
  const {
    performancePostId,
    createdAt,
    userWhoCreated,
    numLikes,
    rating: {
      ratingTierRank,
      frameRateTierRank,
      frameRateStutters,
      gamepadMetadata,
      gamepadTierRank,
    },
    postText,
    postTags,
    steamApp: {
      steamAppId,
      name,
      headerImage,
    },
  } = performancePost;

  const { userSession } = useUserSession();

  const didSteamUserCreatePost = userSession
    ? userWhoCreated.steamUserId64 === userSession.steamUserProfile.steamUserId64
    : false;

  return (
    <div
      id={performancePostId.toString()}
      className="rounded-xl px-0 py-0 bg-tertiary focus:show-ring
                 w-full max-w-sm flex items-center justify-center"
    >
      <div
        className="flex flex-col gap-3 items-center w-full"
      >
        <div className="flex flex-col gap-1">
          <AppHeaderImage
            headerImageSrc={headerImage}
            name={name}
            className="h-full w-full flex justify-center object-cover
                         bg-tertiary rounded-t-xl rounded-b-none"
          />
          <span className="font-semibold self-start pl-2">
            {name}
          </span>
        </div>

        <div className="flex justify-between w-full px-2 pb-1">
          <LikeButton performancePostId={performancePostId} numLikes={numLikes} />
          {didSteamUserCreatePost && (
            <EditButton
              steamAppId={steamAppId}
              performancePostId={performancePostId}
            />
          )}
        </div>
        <TailwindDisclosure title="Rating & Tags" defaultOpen={false} roundedButton={false}>

          <div className="bg-primary w-full flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2">
              <span className="text-primary-faded italic text-sm">
              Rating
              </span>
              <TierRankBadge tierRank={ratingTierRank}>
                {convertRatingTierRankToDescription(ratingTierRank)}
              </TierRankBadge>
            </div>
            {(frameRateTierRank || frameRateStutters) && (
              <div className="flex gap-2 items-center">
                <span className="text-primary-faded italic text-sm">
                Framerate
                </span>
                {(frameRateTierRank) && (
                  <TierRankBadge className="bg-primary-highlight" tierRank={frameRateTierRank}>
                    {`${convertFrameRateTierRankToDescription(frameRateTierRank)}`}
                  </TierRankBadge>
                )}
                {frameRateStutters && <TierRankBadge tierRank={frameRateTierRank} includeRatingLetter={false} className="bg-primary-highlight">{`Stutters`}</TierRankBadge>}
              </div>
            )}
            {(gamepadMetadata && gamepadTierRank) && (
              <div className="flex gap-2 items-center">
                <span className="text-primary-faded italic text-sm">
                Gamepad
                </span>
                <TierRankBadge className="bg-primary-highlight text-xs" tierRank={gamepadTierRank}>
                  {`${gamepadMetadata.description} - ${convertGamepadTierRankToDescription(gamepadTierRank)}`}
                </TierRankBadge>
              </div>
            )}

            {postTags.length > 0 && (
              <div className="flex gap-2 items-center">
                <span className="text-primary-faded italic text-sm">
                  Tags
                </span>
                <div className="flex gap-1 flex-wrap">
                  {postTags.map(({ id, description }) => (
                    <TextPill key={id} className="bg-primary-highlight">{description}</TextPill>
                  ))}
                </div>
              </div>

            )}

          </div>

        </TailwindDisclosure>

        <Link
          to={`/apps/${steamAppId}/posts#${performancePostId}`}
          className="group flex flex-col gap-3 w-full select-none
                     bg-tertiary hover:bg-tertiary-highlight pb-4 pt-2 rounded-xl
                     focus:outline-none focus-visible:show-ring-app-bg"
        >

          <div className="flex justify-between w-full px-2">
            <i className="italic">
              {createdAt}
            </i>
            <span className="text-secondary font-medium relative px-0 py-[0.1em]
                  after:block after:absolute after:bottom-[-1px] after:left-0
                  after:w-0 after:h-[0.2em] after:bg-secondary after:transition-all
                  group-hover:after:w-full group-focus-visible:after:w-full after:rounded-full
                  after:duration-200">
              <span>
                View
              </span>
            </span>
          </div>
          <p className="line-clamp-4 px-2">
            {postText}
          </p>
        </Link>
      </div>
    </div>
  );
}
