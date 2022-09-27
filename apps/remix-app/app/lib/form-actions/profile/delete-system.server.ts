import type { SteamUserSystemSpecs } from '@apple-si-gaming-db/database';
import { json, redirect } from '@remix-run/node';
import { deleteSystemSpecs } from '~/models/steamUserSystemSpecs.server';
import type { ProfileActionData } from '~/routes/profile';

const badRequest = (data: ProfileActionData) => json(data, { status: 400 });

export async function deleteSystem(
    steamUserId: SteamUserSystemSpecs['steamUserId'],
    formData: FormData,
) {
  const systemName = formData.get('systemName');
  if (typeof systemName !== 'string') {
    return badRequest({ formError: `Form not submitted correctly.` });
  }
  await deleteSystemSpecs(steamUserId, systemName);
  return redirect('/profile');
}
