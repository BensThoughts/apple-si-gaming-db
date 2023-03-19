import {
  AppleIcon,
  WindowsIcon,
  LinuxIcon,
} from '~/components/Icons';
import AppHeaderImage from '../ImageWrappers/AppHeaderImage';
import AppInfoExternalLinks from './AppInfoExternalLinks';

export default function AppInfoHeader({
  steamAppId,
  name,
  headerImage,
  releaseDate,
  platformMac,
  platformLinux,
  platformWindows,
}: {
  steamAppId: number;
  name: string;
  headerImage?: string | null;
  releaseDate?: string | null;
  platformMac?: boolean | null;
  platformLinux?: boolean | null;
  platformWindows?: boolean | null;
}) {
  return (
    <div
      className="flex flex-col gap-4 justify-center items-center w-full
                 bg-tertiary p-2 rounded-lg border-1 border-secondary-highlight"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center p-[3px] md:p-[6px] rounded-lg">
          {headerImage && <AppHeaderImage
            headerImageSrc={headerImage}
            name={name}
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
      <div>
        <AppInfoExternalLinks steamAppId={steamAppId} />
      </div>
    </div>
  );
}
