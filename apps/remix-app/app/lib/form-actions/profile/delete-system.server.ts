import { json } from '@remix-run/node';
import { deleteSystemSpec, doesUserOwnSystemSpec } from '~/models/SteamedApples/userSystemSpecs.server';
import type { DeleteSystemSpecActionData, ProfileSystemsActionData } from '~/routes/profile/systems';
import { validateSystemName, validateSystemSpecIdForProfile } from '~/lib/form-validators/profile';
// import { validateSystemName } from '~/lib/form-validators/profile';

const badRequest = (data: DeleteSystemSpecActionData) => (
  json<ProfileSystemsActionData>({
    _profileAction: {
      deleteSystemSpec: data,
    },
  }, { status: 400 })
);

export async function deleteSystem(
    userProfileId: number,
    formData: FormData,
) {
  const systemName = formData.get('systemName');
  const systemSpecIdString = formData.get('systemSpecId');
  if (
    typeof systemName !== 'string' ||
    typeof systemSpecIdString !== 'string'
  ) {
    return badRequest({ formError: `Delete system form not submitted correctly.` });
  }
  const systemSpecId = Number(systemSpecIdString);
  const fieldErrors = {
    systemSpecId: validateSystemSpecIdForProfile(systemSpecId),
    systemName: validateSystemName(systemName),
  };
  const fields = {
    systemSpecId,
    systemName,
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const doesUserOwnSystem = await doesUserOwnSystemSpec(userProfileId, systemSpecId);
  if (!doesUserOwnSystem) {
    return badRequest({ formError: 'You are attempting to delete a system that you do not own or does not exist' });
  }

  await deleteSystemSpec(systemSpecId);

  return json<ProfileSystemsActionData>({ _profileAction: {} });
}
