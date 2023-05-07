import { json, redirect } from '@remix-run/node';
import type { ActionArgs } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import type {
  PerformancePost,
} from '~/types/remix-app';
import { validatePerformancePostId, validateSteamAppId } from '~/lib/loader-functions/params-validators.server';
import { didSteamUserProfileCreatePerformancePost, findPerformancePostById } from '~/models/SteamedApples/performancePost.server';
import { useActionData, useCatch, useLoaderData, useNavigation } from '@remix-run/react';
import { findPostTags } from '~/models/SteamedApples/performancePostTag.server';
import { findAllGamepads } from '~/models/SteamedApples/gamepadMetadata.server';
import PerformancePostCard from '~/components/PerformancePostCards/PerformancePostCard';
import { editPerformancePostAction } from '~/lib/form-actions/performance-post/edit-post.server';
import { requireUserIds } from '~/lib/sessions/profile-session.server';
import ErrorDisplay from '~/components/Layout/ErrorDisplay';
import CatchDisplay from '~/components/Layout/CatchDisplay';
import { EditPostURLParams } from '~/lib/enums/URLSearchParams/EditPost';
import EditPerformancePostForm from '~/components/Apps/PerformancePosts/Forms/EditPerformancePostForm';
import { convertRawToTypedPerformancePostFormFields, extractFormData } from '~/lib/form-actions/performance-post/extract-form-data';
import type { GamepadSelectOption } from '~/components/Apps/PerformancePosts/Forms/FormComponents/GamepadRating/GamepadSelectMenu';
import type { PostTagMultiSelectOption } from '~/components/Apps/PerformancePosts/Forms/FormComponents/PostTagMultiSelectMenu';

type EditPostLoaderData = {
  steamAppId: number;
  performancePost: PerformancePost;
  postTagOptions: PostTagMultiSelectOption[];
  gamepadOptions: GamepadSelectOption[];
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

  const postTags = await findPostTags();
  const postTagOptions: PostTagMultiSelectOption[] =
    postTags.map((tag) => ({ label: tag.description, value: tag.id }));
  const gamepads = await findAllGamepads();
  const gamepadOptions: GamepadSelectOption[] =
    gamepads.map((gamepad) => ({ name: gamepad.description, value: gamepad.id }));
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
    postHTML,
    serializedLexicalEditorState,
    rating,
    postTags,
    systemSpec: {
      systemSpecId,
    },
  } = performancePost;

  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const performancePostNavigationFormData = navigation.formData
    ? extractFormData(navigation.formData).fieldsRaw
    : undefined;
  const optimisticPerformancePost = performancePostNavigationFormData
    ? convertRawToTypedPerformancePostFormFields(performancePostNavigationFormData)
    : undefined;
  const isSubmittingEditPerformancePost =
    navigation.state === 'submitting' &&
    navigation.formData.get('_performancePostAction') === 'editPerformancePost';


  return (
    <div className="flex flex-col justify-center items-center gap-6 w-full max-w-[50rem]">
      <PerformancePostCard performancePost={performancePost} />
      <EditPerformancePostForm
        performancePostId={performancePostId}
        steamAppId={steamAppId}
        formError={actionData?.formError}
        fieldErrors={actionData?.fieldErrors}
        fields={optimisticPerformancePost
            ? optimisticPerformancePost
            : actionData?.fields
              ? actionData.fields
              : {
                postText,
                postHTML,
                serializedLexicalEditorState,
                ...performancePost.rating,
                ratingTierRank: rating.ratingTierRank,
                frameRateTierRank: rating.frameRateTierRank,
                frameRateStutters: rating.frameRateStutters ? rating.frameRateStutters : false,
                gamepadId: rating.gamepadMetadata?.id,
                gamepadTierRank: rating.gamepadTierRank,
                postTagIds: postTags.map((tag) => tag.id),
                systemSpecId: systemSpecId,
              }
        }
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
