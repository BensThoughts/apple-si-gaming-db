import { json, redirect } from '@remix-run/node';
import type { ActionArgs } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import type {
  PerformancePost,
} from '~/interfaces';
import { validatePerformancePostId, validateSteamAppId } from '~/lib/loader-functions/params-validators.server';
import { didSteamUserProfileCreatePerformancePost, findPerformancePostById } from '~/models/SteamedApples/performancePost.server';
import { useActionData, useCatch, useLoaderData, useNavigation } from '@remix-run/react';
import { findPostTags } from '~/models/SteamedApples/performancePostTag.server';
import { findAllGamepads } from '~/models/SteamedApples/gamepadMetadata.server';
// import { doesSteamUserOwnApp } from '~/models/steamUser.server';
import EditPerformancePostForm from '~/components/AppInfo/PerformancePosts/PerformancePostForms/EditPerformancePostForm';
import PerformancePostDisplay from '~/components/AppInfo/PerformancePosts/PerformancePostDisplay';
import PostLayoutCard from '~/components/AppInfo/PerformancePosts/PerformancePostLayoutCard';
import { editPerformancePostAction } from '~/lib/form-actions/performance-post/edit-post.server';
import type { PostTagOption, GamepadOption } from '~/interfaces';
import type { EditPerformancePostActionData } from '~/lib/form-actions/performance-post/types';
import { requireUserIds } from '~/lib/sessions/profile-session.server';
import ErrorDisplay from '~/components/Layout/ErrorDisplay';
import CatchDisplay from '~/components/Layout/CatchDisplay';
import { EditPostURLParams } from '~/interfaces/remix-app/URLSearchParams/EditPost';

type EditPostLoaderData = {
  steamAppId: number;
  performancePost: PerformancePost;
  postTagOptions: PostTagOption[];
  gamepadOptions: GamepadOption[];
  redirectToAfterEdit: string | null;
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
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const redirectToAfterEdit = searchParams.get(EditPostURLParams.REDIRECT_TO_AFTER_EDIT);
  return json<EditPostLoaderData>({
    steamAppId,
    performancePost,
    postTagOptions,
    gamepadOptions,
    redirectToAfterEdit,
  });
}

export async function action({
  request,
  params,
}: ActionArgs) {
  const steamAppId = validateSteamAppId(params);
  const performancePostId = validatePerformancePostId(params);
  const { steamUserId64 } = await requireUserIds(request, `/apps/${steamAppId}/posts/`);
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const redirectToAfterEdit = searchParams.get(EditPostURLParams.REDIRECT_TO_AFTER_EDIT);

  const steamUserProfileCreatedPerformancePost = await didSteamUserProfileCreatePerformancePost(steamUserId64, performancePostId);
  if (!steamUserProfileCreatedPerformancePost) {
    return redirect(`/apps/${steamAppId}/posts/`);
  }
  const formData = await request.formData();
  return editPerformancePostAction({
    steamAppId,
    performancePostId,
    formData,
    redirectToAfterEdit,
  });
}

export default function EditPerformancePostRoute() {
  const loaderData = useLoaderData<EditPostLoaderData>();
  const {
    performancePost,
    steamAppId,
    postTagOptions,
    gamepadOptions,
    redirectToAfterEdit,
  } = loaderData;

  const {
    performancePostId,
    postText,
    rating,
    postTags,
    systemSpec: {
      systemSpecId,
    },
  } = performancePost;

  const actionData = useActionData<EditPerformancePostActionData>();
  const navigation = useNavigation();
  const isSubmittingEditPerformancePost =
    navigation.state === 'submitting' &&
    navigation.formData.get('_performancePostAction') === 'editPerformancePost';


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
        redirectToAfterEdit={redirectToAfterEdit}
      />
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  // TODO: /apps is not technically the current route
  return <ErrorDisplay includePageWrapper={false} error={error} currentRoute="/apps" />;
}

export function CatchBoundary() {
  const caught = useCatch();
  // TODO: /apps is not technically the current route
  return (
    <CatchDisplay includePageWrap={false} thrownResponse={caught} currentRoute="/apps" />
  );
}
