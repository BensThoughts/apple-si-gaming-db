import { json } from '@remix-run/node';
import { deleteSystemSpec, doesUserOwnSystemSpec } from '~/models/SteamedApples/userSystemSpecs.server';
import type { DeleteSystemSpecActionData, ProfileSystemsActionData } from './interfaces';
import { validateSystemSpecIdForProfile } from '~/lib/form-validators/profile';
import { DeleteSystemFormFields } from '~/lib/enums/FormFields/SystemSpec';

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
  const systemSpecIdString = formData.get(DeleteSystemFormFields.SystemSpecId);
  if (
    typeof systemSpecIdString !== 'string'
  ) {
    return badRequest({ formError: `Delete system form not submitted correctly.` });
  }
  const systemSpecId = Number(systemSpecIdString);
  const fieldErrors = {
    systemSpecId: validateSystemSpecIdForProfile(systemSpecId),
  };
  const fields = {
    systemSpecId,
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
