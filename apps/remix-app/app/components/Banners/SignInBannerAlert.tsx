// import { useFetcher } from '@remix-run/react';
import { useState } from 'react';
import { InformationCircleIcon, XMarkIcon } from '~/components/Icons';

export default function SignInBannerAlert({
  showBanner,
}: {
  showBanner: boolean;
}) {
  // const fetcher = useFetcher();
  const [showBannerRaw, setShowBannerRaw] = useState(showBanner);

  function onClick() {
    // fetcher.submit(null, { action: '/actions/show-sign-in-banner', method: 'post' });
    setShowBannerRaw(false);
  }

  if (!showBannerRaw) {
    return null;
  }

  return (
    <div
      className="bg-app-bg-secondary rounded text-primary px-4 py-2 shadow-md w-full border-1 border-secondary-highlight"
      // className="fixed z-[999] bottom-6 left-1/2 -translate-x-1/2 w-[80vw] bg-app-bg-secondary rounded text-primary px-4 py-2 shadow-md border-1 border-secondary-highlight"
      role="alert"
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-2 w-full">
          <div className=""><InformationCircleIcon size={24} /></div>
          <div className="flex items-center justify-between w-full gap-1">
            <p className="font-bold text-lg text-primary-highlight">Sign in with Steam today!</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6">
          <a
            href="/api/auth/steam/login"
            className="block w-[114px] h-[43px]"
          // onClick={() => Fathom.trackGoal('7HVQUUZ4', 1)}
          >
            <img
              src="/steam_sign_in.png"
              alt="sign in with steam"
              width={114}
              height={43}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
              }}
            />
          </a>
          <button
            onClick={onClick}
            type="submit"
            className="focus-visible:show-ring"
          >
            <XMarkIcon />
          </button>
        </div>

      </div>
    </div>
  );
}
