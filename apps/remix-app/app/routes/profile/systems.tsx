import { json } from '@remix-run/node';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import SystemsLayout from '~/components/Profile/Systems/SystemsLayout';
import { createSystem } from '~/lib/form-actions/profile/create-system.server';
import { deleteSystem } from '~/lib/form-actions/profile/delete-system.server';
import { editSystem } from '~/lib/form-actions/profile/edit-system.server';
import { useUserProfileSystemSpecs } from '~/lib/hooks/useMatchesData';
// import type { ProfileSystemsActionData } from '~/lib/form-actions/profile/interfaces';
import { requireUserIds } from '~/lib/sessions/profile-session.server';

export async function loader({ request }: LoaderArgs) {
  await requireUserIds(request, '/profile');
  return json({ success: true });
}

export async function action({ request }: ActionArgs) {
  const { userProfileId } = await requireUserIds(request, '/profile');
  const formData = await request.formData();
  const action = formData.get('_profileAction');
  switch (action) {
    case 'createSystem': {
      return createSystem(userProfileId, formData);
    }
    case 'deleteSystem': {
      return deleteSystem(userProfileId, formData);
    }
    case 'editSystem': {
      return editSystem(userProfileId, formData);
    }
    default: {
      throw new Error('Unexpected action in /profile');
    }
  }
}

export default function ProfileSystemsRoute() {
  const userProfileSystemSpecs = useUserProfileSystemSpecs();
  const actionData = useActionData<typeof action>();

  return (
    <SystemsLayout
      systemSpecs={userProfileSystemSpecs}
      // isSubmittingCreateSystemForm={isSubmittingCreateSystemForm}
      createSystemSpecActionData={actionData?._profileAction.createSystemSpec}
      editSystemSpecActionData={actionData?._profileAction.editSystemSpec}
      deleteSystemSpecActionData={actionData?._profileAction.deleteSystemSpec}
    />
  );
}
