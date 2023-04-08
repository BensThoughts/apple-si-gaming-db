import { Link, useMatches } from '@remix-run/react';
import { EditIcon } from '~/components/Icons/FeatherIcons';
import { EditPostURLParams } from '~/lib/enums/URLSearchParams/EditPost';
import { useUserSession } from '~/lib/hooks/useMatchesData';

interface EditButtonProps {
  steamAppId: number;
  performancePostId: number;
  userWhoCreated: { steamUserId64: string };
}

export default function EditButton({
  steamAppId,
  performancePostId,
  userWhoCreated,
}: EditButtonProps) {
  const matches = useMatches();
  const { userSession } = useUserSession();

  const didSteamUserCreatePost = userSession
    ? userWhoCreated.steamUserId64 === userSession.steamUserProfile.steamUserId64
    : false;

  if (!didSteamUserCreatePost) {
    return null;
  }

  const deepestMatch = matches.length > 0
    ? matches[matches.length - 1]
    : undefined;
  const currentlyOnEditPage =
    deepestMatch && deepestMatch.id === 'routes/apps/$steamAppId/posts.edit.$performancePostId'
      ? true
      : false;
  if (currentlyOnEditPage) {
    return null;
  }
  const redirectToAfterEdit = deepestMatch && `${deepestMatch.pathname}#${performancePostId}`;

  let editURL = `/apps/${steamAppId}/posts/edit/${performancePostId}`;
  if (redirectToAfterEdit) {
    const params = new URLSearchParams([
      [EditPostURLParams.REDIRECT_TO_AFTER_EDIT, redirectToAfterEdit],
    ]);
    editURL = editURL.concat(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center">
      <Link
        to={editURL.toString()}
        className="hover:text-primary-highlight bg-primary hover:bg-primary-highlight
                   focus:outline-none min-h-[38px] focus-visible:show-ring-primary
                   flex gap-1 items-center rounded-full border-secondary-highlight
                   border-1 py-1 px-3"
      >
        <div className="pb-0.5">
          <EditIcon className="stroke-1" />
        </div>
        <span className="text-sm font-light">
          Edit
        </span>

      </Link>
    </div>
  );
}
