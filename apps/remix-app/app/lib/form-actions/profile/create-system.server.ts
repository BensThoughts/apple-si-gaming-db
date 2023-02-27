import { redirect, json } from '@remix-run/node';
import { createSystemSpec, findSystemSpecSystemNames } from '~/models/SteamedApples/userSystemSpecs.server';
import type { PrismaUserSystemSpec } from '~/interfaces/database';
import type { CreateSystemSpecActionData, ProfileSystemsActionData } from '~/routes/profile/systems';
import { validateNewSystemName, validateSystemInfo, extractSystemSpecs } from '~/lib/form-validators/profile';

const badRequest = (data: CreateSystemSpecActionData) => (
  json<ProfileSystemsActionData>({
    _profileAction: {
      createSystemSpec: data,
    },
  }, { status: 400 })
);

export async function createSystem(
    userProfileId: PrismaUserSystemSpec['userProfileId'],
    formData: FormData,
) {
  const systemName = formData.get('systemName');
  const systemInfo = formData.get('systemInfo');
  if (
    typeof systemName !== 'string' ||
    typeof systemInfo !== 'string'
  ) {
    return badRequest({ formError: `Form not submitted correctly.` });
  }
  const systemNames = await findSystemSpecSystemNames(userProfileId);
  // if (!systemNames) {
  //   return badRequest({ formError: `Could not find system names. Does user exist? userProfileId: ${userProfileId}` });
  // }
  const fieldErrors = {
    systemName: validateNewSystemName(systemName, systemNames),
    systemInfo: validateSystemInfo(systemInfo),
  };
  const fields = {
    systemName,
    systemInfo,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const systemSpecs = extractSystemSpecs(systemInfo);
  await createSystemSpec(userProfileId, systemName.trim(), systemSpecs);

  return redirect(`/profile/systems`);
}
