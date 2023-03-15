import AsideCard from '~/components/Cards/AsideCard';
import ExternalLink from '~/components/ExternalLink';

export default function PrivacyCard() {
  return (
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
        with this site. Please note that you may need to wait up
        to an hour if you have just recently set your privacy settings
        to public.
      </AsideCard>
    </div>
  );
}
