import type { SteamUserSystemSpecs } from '~/interfaces/database';
import { json, redirect } from '@remix-run/node';
import { deleteSystemSpecs } from '~/models/steamUserSystemSpecs.server';
import type { DeleteSystemSpecActionData, ProfileSystemsActionData } from '~/routes/profile/systems';
// import { validateSystemName } from '~/lib/form-validators/profile';

const badRequest = (data: DeleteSystemSpecActionData) => (
  json<ProfileSystemsActionData>({
    _profileAction: {
      deleteSystemSpec: data,
    },
  }, { status: 400 })
);

export async function deleteSystem(
    steamUserId: SteamUserSystemSpecs['steamUserId'],
    formData: FormData,
) {
  const systemName = formData.get('systemName');
  if (typeof systemName !== 'string') {
    return badRequest({ formError: `Delete system form not submitted correctly.` });
  }

  const fieldErrors = {
    // systemName: validateSystemName(systemName),
  };
  const fields = {
    systemName,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  await deleteSystemSpecs(steamUserId, systemName);
  return redirect('/profile/systems');
}
