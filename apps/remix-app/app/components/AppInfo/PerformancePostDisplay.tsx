import type { PerformancePost, SteamUser } from '~/interfaces/database';

type PerformancePostProps =
  Pick<PerformancePost, 'postText'> &
  Pick<SteamUser, 'avatarMedium' | 'displayName'>

export default function PerformancePostDisplay({
  displayName,
  avatarMedium,
  postText,
}: PerformancePostProps) {
  return (
    <div className='flex flex-col h-52 bg-primary'>
      {postText}
    </div>
  );
}
