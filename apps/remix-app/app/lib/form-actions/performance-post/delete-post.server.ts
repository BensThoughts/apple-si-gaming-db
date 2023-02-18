import { redirect, json } from '@remix-run/node';
import { deletePerformancePost, didCurrentSessionUserCreatePost } from '~/models/steamPerformancePost.server';
import type { DeletePerformancePostActionData } from '~/routes/apps/$steamAppId/performance-posts';

const badRequest = (data: DeletePerformancePostActionData) => json(data, { status: 400 });

export async function deletePerformancePostAction(
    steamUserId: string,
    steamAppId: number,
    formData: FormData,
) {
  const postId = formData.get('postId');
  if (typeof postId !== 'string') {
    return badRequest({
      formError: 'Form not submitted correctly',
    });
  }

  const currentSessionUserCreatedPost = await didCurrentSessionUserCreatePost(steamUserId, postId);
  if (currentSessionUserCreatedPost) {
    await deletePerformancePost(postId);
  }

  return redirect(`/apps/${steamAppId}/performance-posts`);
}
