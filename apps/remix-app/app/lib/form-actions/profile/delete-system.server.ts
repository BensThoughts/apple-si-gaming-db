import type { SteamUserSystemSpecs } from '~/interfaces/database';
import { json, redirect } from '@remix-run/node';
import { deleteSystemSpecs } from '~/models/steamUserSystemSpecs.server';
import type { DeleteSystemSpecActionData, ProfileActionData } from '~/routes/profile';

const badRequest = (data: DeleteSystemSpecActionData) => (
  json<ProfileActionData>({
    _profileAction: {
      deleteSystemSpec: data,
    },
  }, { status: 400 })
);

function validateSystemName(systemInfoName: string) {
  if (systemInfoName.length < 3) {
    return `The system name is too short (3 character minimum)`;
  }
  if (systemInfoName.length > 100) {
    return `The system name is too long (100 character maximum)`;
  }
}

export async function deleteSystem(
    steamUserId: SteamUserSystemSpecs['steamUserId'],
    formData: FormData,
) {
  const systemName = formData.get('systemName');
  if (typeof systemName !== 'string') {
    return badRequest({ formError: `Delete system form not submitted correctly.` });
  }

  const fieldErrors = {
    systemName: validateSystemName(systemName),
  };
  const fields = {
    systemName,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  await deleteSystemSpecs(steamUserId, systemName);
  return redirect('/profile');
}
