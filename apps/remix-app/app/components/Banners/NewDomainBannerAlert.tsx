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
      dismissible={false}
    >
      <p>
      We are now located at{` `}
        <a href="https://www.steamedapples.com/?ref=applesilicongaming.com" className="underline">
        https://www.steamedapples.com
        </a>
      </p>
    </BannerAlert>
  );
}
