import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { likePost } from '~/models/SteamedApples/performancePost.server';
// import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';
import { getProfileSession } from '~/lib/sessions/profile-session.server';

export const action: ActionFunction = async ({ request, context }) => {
  // const { steamUser } = extractAppLoadContext(context);
  const profileSession = await getProfileSession(request);
  const userProfileId = Number(profileSession.getUserProfileId());
  if (!userProfileId || !isFinite(userProfileId) || userProfileId < 0) {
    return json({
      success: false,
      message: `${userProfileId} is not a valid profile id, is user logged in?`,
    });
  }
  const requestText = await request.text();
  const searchParams = new URLSearchParams(requestText);
  const performancePostId = Number(searchParams.get('performancePostId'));
  if (!performancePostId || !isFinite(performancePostId) || (performancePostId < 0)) {
    return json({
      success: false,
      message: `${performancePostId} Not a valid performancePostId`,
    });
  }


  await likePost(performancePostId, userProfileId);

  return json({ success: true });
};
