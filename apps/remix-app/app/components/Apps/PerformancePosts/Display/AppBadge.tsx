import AppHeaderImage from '~/components/ImageWrappers/AppHeaderImage';

export default function PerformancePostAppBadge({
  headerImage,
  name,
  createdAt,
}: {
  headerImage?: string | null;
  name: string;
  createdAt: string;
}) {
  return (
    <div className="flex gap-2 items-center justify-center rounded-md border-0
                    border-secondary-highlight max-w-fit">
      <AppHeaderImage
        headerImageSrc={headerImage}
        name={name}
        className="object-cover w-auto h-[44px]"
      />
      <div className="flex flex-col gap-0">
        <span className="font-semibold">{name}</span>
        <i className="italic text-sm">{createdAt}</i>
        {/* <SystemSpecsPopover systemSpec={systemSpec}>
          <span className="text-xs">
            System
          </span>
        </SystemSpecsPopover> */}
      </div>
    </div>
  );
}
