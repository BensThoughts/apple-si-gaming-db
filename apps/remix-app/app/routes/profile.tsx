import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  useActionData,
  useCatch,
  useLoaderData,
  useMatches,
  useTransition,
} from '@remix-run/react';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { doesSteamUserExists, updateUserOwnedApps, upsertSteamUser } from '~/models/steamUser.server';
import PageWrapper from '~/components/Layout/PageWrapper';
import UserDisplay from '~/components/Profile/UserDisplay';
import { createSystem } from '~/lib/form-actions/profile/create-system.server';
import { deleteSystem } from '~/lib/form-actions/profile/delete-system.server';
import { editSystem } from '~/lib/form-actions/profile/edit-system.server';
import { metaTags } from '~/lib/meta-tags';
// import type { SteamGenre } from '~/interfaces/database';
import type { SerializedRootLoaderData } from '~/root';

interface ProfileLoaderData {
  isLoggedIn: boolean;
  contextData: {
    steamUserId?: string | null;
    displayName?: string | null;
    avatarFull?: string | null,
  }
}

export async function loader({ context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (steamUser) {
    const {
      steamUserId,
      displayName,
      avatarFull,
    } = steamUser;
    return json<ProfileLoaderData>({
      isLoggedIn: true,
      contextData: {
        steamUserId,
        displayName,
        avatarFull,
      },
    });
  }
  return json<ProfileLoaderData>({
    isLoggedIn: false,
    contextData: {},
  });
}

export type CreateSystemSpecActionData = {
  formError?: string;
  fieldErrors?: {
    systemName?: string;
    systemInfo?: string;
  };
  fields?: {
    systemName: string;
    systemInfo: string;
  }
}

export type EditSystemSpecActionData = {
  formError?: string;
  fieldErrors?: {
    systemName?: string;
    updatedSystemName?: string;
  };
  fields?: {
    systemName: string;
    updatedSystemName: string;
  }
}

export type DeleteSystemSpecActionData = {
  formError?: string;
  fieldErrors?: {
    systemName?: string;
  }
  fields?: {
    systemName: string;
  }
}

export type ProfileActionData = {
  _profileAction: {
    createSystemSpec?: CreateSystemSpecActionData;
    editSystemSpec?: EditSystemSpecActionData;
    deleteSystemSpec?: DeleteSystemSpecActionData;
  };
}

export async function action({ request, context }: ActionArgs) {
  const { steamUser } = extractAppLoadContext(context);
  // TODO: This should maybe return more info about the problem
  if (!steamUser) {
    return redirect('/profile');
  }
  const formData = await request.formData();
  const action = formData.get('_profileAction');
  switch (action) {
    case 'createSystem': {
      return createSystem(steamUser.steamUserId, formData);
    }
    case 'deleteSystem': {
      return deleteSystem(steamUser.steamUserId, formData);
    }
    case 'editSystem': {
      return editSystem(steamUser.steamUserId, formData);
    }
    case 'updateOwnedGames': {
      const steamUserExists = await doesSteamUserExists(steamUser.steamUserId);
      if (!steamUserExists) {
        await upsertSteamUser(steamUser);
      }
      await updateUserOwnedApps(steamUser.steamUserId);
      return redirect('/profile');
    }
    default: {
      throw new Error('Unexpected action in /profile');
    }
  }
}

export const meta: MetaFunction = ({ data }: { data: ProfileLoaderData }) => {
  if (data && data.isLoggedIn && data.contextData) {
    const { displayName } = data.contextData;
    return {
      title: displayName ? `${metaTags.title} - Profile - ${displayName}` : `Profile`,
    };
  }
  return {
    title: `${metaTags.title} - Login`,
  };
};

export default function ProfilePage() {
  const {
    isLoggedIn,
    contextData,
  } = useLoaderData<ProfileLoaderData>();
  const {
    avatarFull,
    displayName,
  } = contextData;
  const match = useMatches();
  const rootLoaderData = match[0].data as SerializedRootLoaderData;
  const ownedApps = rootLoaderData.prismaData ? rootLoaderData.prismaData.ownedApps : [];
  const systemSpecs = rootLoaderData.prismaData ? rootLoaderData.prismaData.systemSpecs : [];
  const actionData = useActionData<ProfileActionData>();
  const transition = useTransition();

  const isSubmittingCreateSystemForm =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_profileAction') === 'createSystem';

  const isSubmittingUpdateGames =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_profileAction') === 'updateOwnedGames';

  return (
    <PageWrapper title="Profile">
      <UserDisplay
        isLoggedIn={isLoggedIn}
        avatarFull={avatarFull}
        displayName={displayName}
        ownedApps={ownedApps}
        systemSpecs={systemSpecs}
        isSubmittingCreateSystemForm={isSubmittingCreateSystemForm}
        createSystemSpecActionData={actionData?._profileAction.createSystemSpec}
        editSystemSpecActionData={actionData?._profileAction.editSystemSpec}
        deleteSystemSpecActionData={actionData?._profileAction.deleteSystemSpec}
        isSubmittingUpdateGames={isSubmittingUpdateGames}
      />
    </PageWrapper>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <PageWrapper>
      <h1>Error in /profile route</h1>
      <div>{error.message}</div>
    </PageWrapper>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <PageWrapper title="Oops!">
      <div>
        <h1>Oops! - {caught.status} - {caught.data}</h1>
        {caught.status === 404 && (
          <img
            src="/svg-images/four-oh-four-error.svg"
            alt="Four oh four error"
          />
        )}
      </div>
    </PageWrapper>
  );
}
