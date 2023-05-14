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
    <div className="flex gap-2 items-center rounded-md border-0
                    border-secondary-highlight grow">
      <AppHeaderImage
        headerImageSrc={headerImage}
        name={name}
        className="object-cover w-auto h-[44px]"
      />
      <div className="flex flex-col gap-0 overflow-hidden">
        <span className="font-semibold break-words text-ellipsis overflow-hidden">{name}</span>
        <i className="italic text-sm">{createdAt}</i>
      </div>
    </div>
  );
}
