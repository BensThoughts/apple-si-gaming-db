import type { PerformancePost, SteamUser } from '~/interfaces/database';

type PerformancePostProps =
  Pick<PerformancePost, 'postText'> &
  Pick<SteamUser, 'avatarMedium' | 'displayName'> &
  React.HTMLAttributes<HTMLDivElement>

export default function PerformancePostDisplay({
  displayName,
  avatarMedium,
  postText,
  ...rest
}: PerformancePostProps) {
  return (
    <div className='flex flex-row w-full gap-[1px]' {...rest}>
      <div className='flex flex-col items-center justify-center pr-3 border-r-2 border-r-secondary'>
        {avatarMedium && (
          <div>
            <img
              src={avatarMedium}
              alt='avatar'
              width={64}
              height={64}
              onError={(e) => {
                e.currentTarget.src = '/no-image-placeholder.svg';
              }}
            />
          </div>
        )}
        <span className='text-sm'>{displayName}</span>
      </div>
      <div className='border-l-1 border-l-secondary-highlight pl-3'>
        {postText}
      </div>
    </div>
  );
}
