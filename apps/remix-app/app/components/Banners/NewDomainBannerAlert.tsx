import BannerAlert from './BannerAlert';

export default function NewDomainBannerAlert({
  showBanner,
  redirectTo,
}: {
  showBanner: boolean;
  redirectTo: string;
}) {
  return (
    <BannerAlert
      bannerTitle="Our domain name is changing!"
      bannerName="newDomainName"
      showBanner={showBanner}
      redirectTo={redirectTo}
    >
      <p>
      We are now located at{` `}
        <a href="https://www.steamedapples.com" className="underline">
        https://www.steamedapples.com
        </a>
      </p>
    </BannerAlert>
  );
}
