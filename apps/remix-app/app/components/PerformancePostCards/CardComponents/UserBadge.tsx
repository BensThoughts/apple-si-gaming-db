import AvatarImage from '~/components/ImageWrappers/AvatarImage';

export default function PerformancePostUserBadge({
  avatarMedium,
  displayName,
  createdAt,
}: {
  avatarMedium?: string | null;
  displayName?: string | null;
  createdAt: string;
}) {
  return (
    <div className="flex gap-2 items-start justify-center rounded-md border-0
                    border-secondary-highlight max-w-fit">
      <div className="w-10 h-10">
        <AvatarImage avatarMedium={avatarMedium} />
      </div>
      <div className="flex flex-col gap-0">
        <i className="italic text-sm">{createdAt}</i>
        <span className="text-xs">{displayName}</span>
        {/* <SystemSpecsPopover systemSpec={systemSpec}>
          <span className="text-xs">
            System
          </span>
        </SystemSpecsPopover> */}
      </div>
    </div>
  );
}
