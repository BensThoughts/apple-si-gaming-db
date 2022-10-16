import AsideCard from '~/components/Cards/AsideCard';
import ExternalLink from '~/components/ExternalLink';
import ProfileDisplay from './ProfileDisplay';

interface LoginLayoutProps {
  isLoggedIn: boolean;
  avatarFull?: string | null;
  displayName?: string | null;
}

export default function LoginLayout({
  isLoggedIn,
  avatarFull,
  displayName,
}: LoginLayoutProps) {
  return (
    <div
      className="flex flex-col md:flex-row gap-4 md:gap-6 md:justify-evenly
               items-center p-4 md:p-6 rounded-lg border-1
               border-secondary-highlight bg-tertiary w-full max-w-3xl"
    >
      <ProfileDisplay
        isLoggedIn={isLoggedIn}
        displayName={displayName}
        avatarFull={avatarFull}
      />
      <div className="flex items-center justify-center w-full h-full">
        <AsideCard title="Note" iconBackground="bg-tertiary" className="max-w-md">
        Within your&nbsp;
          <ExternalLink
            href="https://steamcommunity.com/my/edit/settings"
            className="underline-offset-2"
          >
          Steam Privacy Settings
          </ExternalLink>
        , &apos;My profile&apos; and &apos;Game Details&apos;
        must be set to public to synchronize your Steam library
        with this site.
        </AsideCard>
      </div>
    </div>
  );
}
