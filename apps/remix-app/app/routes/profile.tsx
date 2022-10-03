import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
import AsideCard from '~/components/Cards/AsideCard';
import LoginCard from '~/components/Profile/LoginCard';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { findUserProfileData } from '~/models/steamUser.server';
import ExternalLink from '~/components/ExternalLink';
import PageWrapper from '~/components/Layout/PageWrapper';
import UserDisplay from '~/components/Profile/UserDisplay';
import { createSystem } from '~/lib/form-actions/profile/create-system.server';
import { deleteSystem } from '~/lib/form-actions/profile/delete-system.server';
import { editSystem } from '~/lib/form-actions/profile/edit-system.server';

export async function loader({ request, context }: LoaderArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (steamUser) {
    const userProfile = await findUserProfileData(steamUser.steamUserId);
    if (userProfile) {
      const {
        steamUserId,
        displayName,
        avatarFull,
        ownedApps,
        systemSpecs,
      } = userProfile;
      return json({
        isLoggedIn: true,
        steamUserId,
        displayName,
        avatarFull,
        ownedApps,
        systemNames: systemSpecs.map((systemSpec) => systemSpec.systemName),
        systemSpecs,
      });
    } else {
      return json({
        isLoggedIn: true,
        steamUserId: null,
        displayName: null,
        avatarFull: null,
        ownedApps: [],
        systemNames: [],
        systemSpecs: [],
      });
    }
  }
  return json({
    isLoggedIn: false,
    steamUserId: null,
    displayName: null,
    avatarFull: null,
    ownedApps: [],
    systemNames: [],
    systemSpecs: [],
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
    default: {
      throw new Error('Unexpected action in /profile');
    }
  }
}

export const meta: MetaFunction = ({ data }) => {
  if (data.isLoggedIn) {
    return {
      title: data.displayName ? `Profile - ${data.displayName}` : `Profile`,
    };
  }
  return {
    title: 'Login',
  };
};

export default function ProfilePage() {
  const {
    isLoggedIn,
    displayName,
    avatarFull,
    ownedApps,
    systemSpecs,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<ProfileActionData>();
  const transition = useTransition();

  const isSubmittingCreateSystem =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_profileAction') === 'createSystem';

  return (
    <PageWrapper title="Profile">
      <div className="flex flex-col gap-10 items-center w-full">
        <div className="flex flex-col md:flex-row gap-8 justify-evenly">
          <LoginCard
            isLoggedIn={isLoggedIn}
            displayName={displayName}
            avatarFull={avatarFull}
          />
          <div className="max-w-md">
            <AsideCard title="Note" iconBackground="secondary">
              Within your&nbsp;
              <ExternalLink
                href="https://steamcommunity.com/my/edit/settings"
                className="underline-offset-2"
              >
                Steam Privacy Settings
              </ExternalLink>
            , &apos;My profile&apos; must be set to public. &apos;Game Details&apos;
            is also required to be public, so that ownership can be verified for your contributions.
            </AsideCard>
          </div>
        </div>
        {isLoggedIn ? (
          <div>
            <UserDisplay
              ownedApps={ownedApps}
              systemSpecs={systemSpecs}
              isSubmittingCreateSystem={isSubmittingCreateSystem}
              createSystemSpecActionData={actionData?._profileAction.createSystemSpec}
              editSystemSpecActionData={actionData?._profileAction.editSystemSpec}
              deleteSystemSpecActionData={actionData?._profileAction.deleteSystemSpec}
            />
          </div>
        ) : (
          null
        )}
      </div>
    </PageWrapper>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Error in /profile route</h1>
      <div>{error.message}</div>
    </div>
  );
}
