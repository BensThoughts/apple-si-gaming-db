import { json } from '@remix-run/node';
import type { ActionArgs } from '@remix-run/node';
import { deletePerformancePost, didSteamUserProfileCreatePerformancePost } from '~/models/SteamedApples/performancePost.server';
import { extractAppLoadContext } from '~/lib/data-utils/appLoadContext.server';

export async function action({ request, context }: ActionArgs) {
  const { steamUser } = extractAppLoadContext(context);
  if (!steamUser) {
    return json({
      success: false,
      message: `Steam User not found in app load context`,
    });
  }
  const { steamUserId64 } = steamUser;

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
