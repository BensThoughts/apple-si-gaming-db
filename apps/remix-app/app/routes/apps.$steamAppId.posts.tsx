import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useCatch, useLoaderData, useNavigation } from '@remix-run/react';
import PerformancePostLayout from '~/components/Apps/PerformancePosts/PerformancePostLayout';
import { findPerformancePostsBySteamAppId } from '~/models/SteamedApples/performancePost.server';
import { findPostTags } from '~/models/SteamedApples/performancePostTag.server';
import { doesSteamUserOwnApp } from '~/models/Steam/steamUserProfile.server';
import { validateSteamAppId } from '~/lib/loader-functions/params-validators.server';
import { findAllGamepads } from '~/models/SteamedApples/gamepadMetadata.server';
import { createPerformancePostAction } from '~/lib/form-actions/performance-post/create-post.server';
import type {
  PerformancePost,
} from '~/types/remix-app';
import type { PostTagMultiSelectOption } from '~/components/Apps/PerformancePosts/Forms/FormComponents/PostTagMultiSelectMenu';
import type { GamepadSelectOption } from '~/components/Apps/PerformancePosts/Forms/FormComponents/GamepadRating/GamepadSelectMenu';
import { getIsLoggedIn, getUserIds, requireUserIds } from '~/lib/sessions/profile-session.server';
import ErrorDisplay from '~/components/Layout/ErrorDisplay';
import CatchDisplay from '~/components/Layout/CatchDisplay';
import CreatePerformancePostForm from '~/components/Apps/PerformancePosts/Forms/CreatePerformancePostForm';
import { convertRawToTypedPerformancePostFormFields, extractFormData } from '~/lib/form-actions/performance-post/extract-form-data';
// import CreatePerformancePostForm from '~/components/Apps/PerformancePosts/FormsV2/CreatePerformancePostForm';
// import { links as draftEditorLinks } from '~/components/Apps/PerformancePosts/FormsV2/FormComponents/DraftEditor/DraftEditor';

// // export const links: LinksFunction = () => {
// //   return [
// // { rel: 'canonical', href: '' },
// // ...draftEditorLinks(),
// //   ];
// // }

interface PerformancePostLoaderData {
  steamAppId: number;
  steamUserProfileOwnsApp: boolean;
  performancePosts: PerformancePost[];
  postTagOptions: PostTagMultiSelectOption[];
  gamepadOptions: GamepadSelectOption[];
}

export async function loader({ params, request }: LoaderArgs) {
  const steamAppId = validateSteamAppId(params);
  const performancePosts = await findPerformancePostsBySteamAppId(steamAppId);
  const isLoggedIn = await getIsLoggedIn(request);
  const { steamUserId64 } = await getUserIds(request);
  let steamUserProfileOwnsApp = false;
  let postTagOptions: PostTagMultiSelectOption[] = [];
  let gamepadOptions: GamepadSelectOption[] = [];
  if (isLoggedIn && steamUserId64) {
    steamUserProfileOwnsApp = await doesSteamUserOwnApp(steamUserId64, steamAppId);
    const postTags = await findPostTags();
    postTagOptions = postTags.map((tag) => ({ label: tag.description, value: tag.id }));
    const gamepads = await findAllGamepads();
    gamepadOptions = gamepads.map((gamepad) => ({ name: gamepad.description, value: gamepad.id }));
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

  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const performancePostNavigationFormData = navigation.formData
    ? extractFormData(navigation.formData).fieldsRaw
    : undefined;
  const optimisticPerformancePost = performancePostNavigationFormData
    ? convertRawToTypedPerformancePostFormFields(performancePostNavigationFormData)
    : undefined;
  const isSubmittingCreatePerformancePost =
    navigation.state === 'submitting' &&
    navigation.formData.get('_performancePostAction') === 'createPerformancePost';

  return (
    <div className="flex flex-col justify-center items-center gap-6 w-full max-w-[50rem]">
      <PerformancePostLayout performancePosts={performancePosts} />
      <CreatePerformancePostForm
        steamAppId={steamAppId}
        steamUserProfileOwnsApp={steamUserProfileOwnsApp}
        formError={actionData?.formError}
        fieldErrors={actionData?.fieldErrors}
        fields={optimisticPerformancePost ? optimisticPerformancePost : actionData?.fields}
        isSubmittingForm={isSubmittingCreatePerformancePost}
        postTagOptions={postTagOptions}
        gamepadOptions={gamepadOptions}
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
