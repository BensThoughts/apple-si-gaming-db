import type { PrismaPerformancePost, PrismaSteamUser } from '~/interfaces';

type PerformancePostProps =
  Pick<PrismaPerformancePost, 'postText'> &
  Pick<PrismaSteamUser, 'avatarMedium' | 'displayName'>

export default function PerformancePost({
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
