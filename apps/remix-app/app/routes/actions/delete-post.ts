import { json } from '@remix-run/node';
import type { ActionArgs } from '@remix-run/node';
import { deletePerformancePost, didSteamUserProfileCreatePerformancePost } from '~/models/SteamedApples/performancePost.server';
import { getProfileSession } from '~/lib/sessions/profile-session.server';

export async function action({ request }: ActionArgs) {
  const profileSession = await getProfileSession(request);
  const steamUserId64 = profileSession.getSteamUserId64();
  if (!steamUserId64) {
    return json({
      success: false,
      message: `Steam User not found in profile session!`,
    });
  }

  const requestText = await request.text();
  const searchParams = new URLSearchParams(requestText);
  const performancePostId = Number(searchParams.get('performancePostId'));
  const steamUserProfileCreatedPerformancePost = await didSteamUserProfileCreatePerformancePost(steamUserId64, performancePostId);
  if (!steamUserProfileCreatedPerformancePost) {
    return json({
      success: false,
      message: `Steam user did not create post,
                steamUserId64: ${steamUserId64}
                performancePostId: ${performancePostId}`,
    });
  }
  await deletePerformancePost(performancePostId);
  return json({ success: true });
}
