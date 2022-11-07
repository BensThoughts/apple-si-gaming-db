import { useState } from 'react';
import { useSubmit } from '@remix-run/react';
import { InformationCircleIcon, XMarkIcon } from '../Icons';

export default function BannerAlert({
  bannerName,
  bannerTitle,
  showBanner,
  redirectTo,
  dismissible = true,
  children,
}: {
  bannerName: string;
  bannerTitle: string;
  showBanner: boolean;
  redirectTo: string;
  dismissible?: boolean;
  children?: React.ReactNode;
}) {
  const submit = useSubmit();
  const [showBannerRaw, setShowBannerRaw] = useState(showBanner);

  function onClick() {
    const formData = new FormData();
    formData.set('redirectTo', redirectTo);
    formData.set('bannerName', bannerName);
    submit(formData, { action: '/actions/hide-banner', method: 'post' });
    setShowBannerRaw(false);
  }

  if (!showBannerRaw) {
    return null;
  }

  return (
    <div className="bg-tertiary border-t-4 border-secondary rounded-b text-primary px-4 py-3 shadow-md" role="alert">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="py-1"><InformationCircleIcon size={24} /></div>
          <div>
            <p className="font-bold text-primary-highlight">{bannerTitle}</p>
            {children && <div className="text-sm">{children}</div>}
          </div>
        </div>
        {dismissible &&
          <button
            onClick={onClick}
            type="submit"
            className="focus-visible:show-ring"
          >
            <XMarkIcon />
          </button>
        }
      </div>
    </div>
  );
}
