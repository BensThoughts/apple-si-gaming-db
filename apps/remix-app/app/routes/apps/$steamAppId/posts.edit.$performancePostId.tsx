import { json, redirect } from '@remix-run/node';
import type { ActionArgs } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import type {
  PerformancePostBase,
  PerformancePostLikes,
  PerformancePostRating,
  PerformancePostSteamApp,
  PerformancePostSystem,
  PerformancePostTag,
  PerformancePostUserWhoCreated,
} from '~/interfaces';
import { validatePerformancePostId, validateSteamAppId } from '~/lib/loader-functions/params-validators.server';
import { didSteamUserProfileCreatePerformancePost, findPerformancePostById } from '~/models/SteamedApples/performancePost.server';
import { useActionData, useLoaderData, useTransition } from '@remix-run/react';
import { findPostTags } from '~/models/SteamedApples/performancePostTag.server';
import { findAllGamepads } from '~/models/SteamedApples/gamepadMetadata.server';
// import { doesSteamUserOwnApp } from '~/models/steamUser.server';
import EditPerformancePostForm from '~/components/AppInfo/PerformancePosts/PerformancePostForms/EditPerformancePostForm';
import PerformancePostDisplay from '~/components/AppInfo/PerformancePosts/PerformancePostDisplay';
import PostLayoutCard from '~/components/AppInfo/PerformancePosts/PerformancePostLayoutCard';
import { editPerformancePostAction } from '~/lib/form-actions/performance-post/edit-post.server';
import type { PostTagOption, GamepadOption } from '~/interfaces';
import type { CreateOrEditPerformancePostActionData } from '~/lib/form-actions/performance-post/create-or-edit-action-type';
import { requireUserIds } from '~/lib/sessions/profile-session.server';

type EditPostLoaderData = {
  steamAppId: number;
  performancePost: PerformancePostBase & {
    steamApp: PerformancePostSteamApp;
    rating: PerformancePostRating;
    likes: PerformancePostLikes;
    system: PerformancePostSystem;
    userWhoCreatedPost: PerformancePostUserWhoCreated;
    postTags: PerformancePostTag[];
  };
  postTagOptions: PostTagOption[];
  gamepadOptions: GamepadOption[];
}

export async function loader({ params, request }: LoaderArgs) {
  const steamAppId = validateSteamAppId(params);
  const performancePostId = validatePerformancePostId(params);
  const { steamUserId64 } = await requireUserIds(request, `/apps/${steamAppId}/posts/`);

  const steamUserProfileCreatedPerformancePost =
      await didSteamUserProfileCreatePerformancePost(steamUserId64, performancePostId);
  if (!steamUserProfileCreatedPerformancePost) {
    return redirect(`/apps/${steamAppId}/posts/`);
  }

  const postTagOptions: PostTagOption[] = await findPostTags();
  const gamepadOptions: GamepadOption[] = await findAllGamepads();
  const performancePost = await findPerformancePostById(performancePostId);
  if (!performancePost) {
    return redirect(`/apps/${steamAppId}/posts`);
    // throw Error(`Post with ${performancePostId} not found in database`);
  }
  return json<EditPostLoaderData>({
    steamAppId,
    performancePost,
    postTagOptions,
    gamepadOptions,
  });
}

export async function action({
  request,
  params,
  context,
}: ActionArgs) {
  const steamAppId = validateSteamAppId(params);
  const performancePostId = validatePerformancePostId(params);
  const { steamUserId64 } = await requireUserIds(request, `/apps/${steamAppId}/posts/`);

  const steamUserProfileCreatedPerformancePost = await didSteamUserProfileCreatePerformancePost(steamUserId64, performancePostId);
  if (!steamUserProfileCreatedPerformancePost) {
    return redirect(`/apps/${steamAppId}/posts/`);
  }
  const formData = await request.formData();
  return editPerformancePostAction({
    steamAppId,
    performancePostId,
    formData,
  });
}

export default function EditPerformancePostRoute() {
  const loaderData = useLoaderData<EditPostLoaderData>();
  const {
    performancePost,
    steamAppId,
    postTagOptions,
    gamepadOptions,
  } = loaderData;

  const {
    performancePostId,
    postText,
    rating,
    postTags,
    system: {
      systemSpecId,
    },
  } = performancePost;

  const actionData = useActionData<CreateOrEditPerformancePostActionData>();
  const transition = useTransition();
  const isSubmittingEditPerformancePost =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_performancePostAction') === 'editPerformancePost';


  return (
    <div className="flex flex-col gap-3">

      <PostLayoutCard>
        <PerformancePostDisplay
          performancePost={{
            ...performancePost,
            createdAt: new Date(performancePost.createdAt),
          }}
        />
      </PostLayoutCard>

      <EditPerformancePostForm
        performancePostId={performancePostId}
        steamAppId={steamAppId}
        formError={actionData?.formError}
        fieldErrors={actionData?.fieldErrors}
        fields={actionData?.fields ? actionData.fields : {
          postText,
          ratingMedal: rating.ratingMedal,
          frameRateAverage: rating.frameRateAverage,
          frameRateStutters: rating.frameRateStutters ? rating.frameRateStutters : false,
          gamepadId: rating.gamepadMetadata?.id,
          gamepadRating: rating.gamepadRating,
          postTagsIds: postTags.map((tag) => tag.id),
          systemSpecId: systemSpecId ? systemSpecId : undefined,
        }}
        isSubmittingForm={isSubmittingEditPerformancePost}
        postTagOptions={postTagOptions}
        gamepadOptions={gamepadOptions}
      />
    </div>
  );
}
