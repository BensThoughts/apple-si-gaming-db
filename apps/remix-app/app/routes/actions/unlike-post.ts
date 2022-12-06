import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { unlikePost } from '~/models/steamPerformancePost.server';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';

export const action: ActionFunction = async ({ request, context }) => {
  const { steamUser } = extractAppLoadContext(context);
  if (!steamUser) {
    return json({
      success: false,
      message: 'User not logged in',
    });
  }
  const requestText = await request.text();
  const searchParams = new URLSearchParams(requestText);
  const postId = searchParams.get('postId');
  if (!postId) {
    return json({
      success: false,
      message: 'Not a valid postId',
    });
  }


  await unlikePost(postId, steamUser.steamUserId);

  return json({ success: true });
};
