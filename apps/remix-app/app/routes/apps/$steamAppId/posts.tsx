import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useCatch, useLoaderData, useTransition } from '@remix-run/react';
import PerformancePostLayout from '~/components/AppInfo/PerformancePosts/PerformancePostLayout';
// import type { GamepadRating, RatingMedal, FrameRate } from '~/interfaces/database';
import { findPerformancePostsBySteamAppId } from '~/models/SteamedApples/performancePost.server';
import { findPostTags } from '~/models/SteamedApples/performancePostTag.server';
import { doesSteamUserOwnApp } from '~/models/Steam/steamUserProfile.server';
import { validateSteamAppId } from '~/lib/loader-functions/params-validators.server';
import { findAllGamepads } from '~/models/SteamedApples/gamepadMetadata.server';
import { createPerformancePostAction } from '~/lib/form-actions/performance-post/create-post.server';
import type {
  PerformancePost,
} from '~/interfaces';
import CreatePerformancePostForm from '~/components/AppInfo/PerformancePosts/PerformancePostForms/CreatePerformancePostForm';
import type { PostTagOption, GamepadOption } from '~/interfaces';
import type { CreateOrEditPerformancePostActionData } from '~/lib/form-actions/performance-post/create-or-edit-action-type';
import { getIsLoggedIn, getUserIds, requireUserIds } from '~/lib/sessions/profile-session.server';

interface PerformancePostLoaderData {
  steamAppId: number;
  steamUserProfileOwnsApp: boolean;
  performancePosts: PerformancePost[];
  postTagOptions: PostTagOption[];
  gamepadOptions: GamepadOption[];
}

export async function loader({ params, request }: LoaderArgs) {
  const steamAppId = validateSteamAppId(params);
  const performancePosts = await findPerformancePostsBySteamAppId(steamAppId);
  const isLoggedIn = await getIsLoggedIn(request);
  const { steamUserId64 } = await getUserIds(request);
  let steamUserProfileOwnsApp = false;
  let postTagOptions: PostTagOption[] = [];
  let gamepadOptions: GamepadOption[] = [];
  if (isLoggedIn && steamUserId64) {
    steamUserProfileOwnsApp = await doesSteamUserOwnApp(steamUserId64, steamAppId);
    postTagOptions = await findPostTags();
    gamepadOptions = await findAllGamepads();
  }
  return json<PerformancePostLoaderData>({
    steamAppId,
    steamUserProfileOwnsApp,
    performancePosts,
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
  const { steamUserId64 } = await requireUserIds(request, `/apps/${steamAppId}/posts`);

  const formData = await request.formData();
  const action = formData.get('_performancePostAction');

  switch (action) {
    case 'createPerformancePost': {
      return createPerformancePostAction({
        steamAppId,
        steamUserId64,
        formData,
      });
    }
    default: {
      throw new Error(`Unexpected action in /apps/${steamAppId}/posts`);
    }
  }
}


export default function PerformancePostsRoute() {
  const {
    steamAppId,
    steamUserProfileOwnsApp,
    performancePosts,
    postTagOptions,
    gamepadOptions,
  } = useLoaderData<PerformancePostLoaderData>();

  const actionData = useActionData<CreateOrEditPerformancePostActionData>();
  const transition = useTransition();
  const isSubmittingCreatePerformancePost =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_performancePostAction') === 'createPerformancePost';

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full">
        <PerformancePostLayout
          performancePosts={performancePosts.map((post) => ({
            ...post,
            createdAt: new Date(post.createdAt),
          }))}
        />
      </div>
      <div className="w-full">
        <CreatePerformancePostForm
          steamAppId={steamAppId}
          steamUserProfileOwnsApp={steamUserProfileOwnsApp}
          formError={actionData?.formError}
          fieldErrors={actionData?.fieldErrors}
          fields={actionData?.fields}
          isSubmittingForm={isSubmittingCreatePerformancePost}
          postTagOptions={postTagOptions}
          gamepadOptions={gamepadOptions}
        />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Error in /apps/$appid/posts route</h1>
      <div>{error.message}</div>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>Oops! - {caught.status} - {caught.data}</h1>
      <p>Error in /apps/$steamAppId/posts route</p>
    </div>
  );
}
