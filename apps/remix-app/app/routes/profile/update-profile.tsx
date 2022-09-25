import type { ActionArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { createSystemSpecs } from '~/models/steamUserSystemSpecs.server';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';


export async function loader() {
  return redirect('/profile');
}

export type UpdateProfileActionData = {
  formError?: string;
  fieldErrors?: {
    systemInfoName?: string | undefined;
    systemInfoData?: string | undefined;
  };
  fields?: {
    systemInfoName: string;
    systemInfoData: string;
  };
};

const badRequest = (data: UpdateProfileActionData) => {
  return json(
      data,
      {
        status: 400,
        headers: {
          'Location': '/profile',
        },
      },
  );
};

function validateSystemData(systemInfoData: string) {
  if (systemInfoData.length < 3) {
    return `The system data info is too short (3 character minimum)`;
  }
  // if (systemInfoData.length > 500) {
  //   return `The system data info is too long (500 character maximum)`;
  // }
}

function validateSystemName(systemInfoName: string) {
  if (systemInfoName.length < 3) {
    return `The system name is too short (3 character minimum)`;
  }
  if (systemInfoName.length > 100) {
    return `The system name is too long (100 character maximum)`;
  }
}

export async function action({
  request,
  params,
  context,
}: ActionArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (!steamUser) {
    return redirect('/profile');
  }
  const formData = await request.formData();
  const systemInfoName = formData.get('systemInfoName');
  const systemInfoData = formData.get('systemInfoData');

  if (
    typeof systemInfoName !== 'string' ||
    typeof systemInfoData !== 'string'
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }
  const fieldErrors = {
    systemInfoName: validateSystemName(systemInfoName),
    systemInfoData: validateSystemData(systemInfoData),
  };
  const fields = {
    systemInfoName,
    systemInfoData,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  await createSystemSpecs(steamUser.steamUserId, systemInfoName, systemInfoData);

  return redirect(`/profile`);
}


