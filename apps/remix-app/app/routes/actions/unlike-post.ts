import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { unlikePost } from '~/models/SteamedApples/performancePost.server';
import { getProfileSession } from '~/lib/sessions/profile-session.server';

export const action: ActionFunction = async ({ request, context }) => {
  // const { steamUser } = extractAppLoadContext(context);
  // if (!steamUser) {
  //   return json({
  //     success: false,
  //     message: 'User not logged in',
  //   });
  // }
  const profileSession = await getProfileSession(request);
  const userProfileId = Number(profileSession.getUserProfileId());
  const requestText = await request.text();
  const searchParams = new URLSearchParams(requestText);
  const postId = searchParams.get('postId');
  if (!postId) {
    return json({
      success: false,
      message: 'Not a valid postId',
    });
  }


  await unlikePost(postId, userProfileId);

  return json({ success: true });
};
