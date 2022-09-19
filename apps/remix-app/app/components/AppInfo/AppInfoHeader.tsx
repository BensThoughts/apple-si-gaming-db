import {
  AppleIcon,
  WindowsIcon,
  LinuxIcon,
} from '~/components/Icons';

export default function AppInfoHeader({
  headerImage,
  releaseDate,
  platformMac,
  platformLinux,
  platformWindows,
}: {
  headerImage?: string | null;
  releaseDate?: string | null;
  platformMac?: boolean | null;
  platformLinux?: boolean | null;
  platformWindows?: boolean | null;
}) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center max-w-2xl">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center bg-primary-highlight p-[3px] md:p-[6px] rounded-lg">
          {headerImage && <img
            src={headerImage}
            alt={`Header for ${name}`}
            width={460}
            height={215}
            className="rounded-md"
            onError={(e) => {
              e.currentTarget.src = '/no-image-placeholder.svg';
            }}
          />}
        </div>

        <div className="flex flex-row justify-between text-sm px-2">
          {releaseDate && (
            <span>
          Released:&nbsp;
              <i className="italic">{releaseDate}</i>
            </span>
          )}
          <div className="flex gap-1">
            <AppleIcon
              size={19}
              className={platformMac ? `text-icon-secondary-highlight` : `text-icon-primary-highlight`}
            />
            <WindowsIcon
              size={19}
              className={platformWindows ? `text-icon-secondary-highlight` : `text-icon-primary-highlight`}
            />
            <LinuxIcon
              size={19}
              className={platformLinux ? `text-icon-secondary-highlight` : `text-icon-primary-highlight`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
