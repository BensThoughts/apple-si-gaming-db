import { redirect, json } from '@remix-run/node';
import { deletePerformancePost, didCurrentSessionUserCreatePost } from '~/models/SteamedApples/performancePost.server';
import type { DeletePerformancePostActionData } from '~/routes/apps/$steamAppId/performance-posts';

const badRequest = (data: DeletePerformancePostActionData) => json(data, { status: 400 });

export async function deletePerformancePostAction(
    steamUserId64: string,
    steamAppId: number,
    formData: FormData,
) {
  const performancePostId = formData.get('performancePostId');
  if (typeof performancePostId !== 'string') {
    return badRequest({
      formError: 'Form not submitted correctly',
    });
  }
  const performancePostIdAsNumber = Number(performancePostId);

  const currentSessionUserCreatedPost = await didCurrentSessionUserCreatePost(steamUserId64, performancePostIdAsNumber);
  if (currentSessionUserCreatedPost) {
    await deletePerformancePost(performancePostIdAsNumber);
  }

  return redirect(`/apps/${steamAppId}/performance-posts`);
}
