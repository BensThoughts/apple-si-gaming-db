import { InformationCircleIcon } from '../Icons';

export default function NewDomainBannerAlert() {
  return (
    <div className="bg-tertiary rounded text-primary px-4 py-3 shadow-md" role="alert">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="py-1"><InformationCircleIcon size={24} /></div>
          <div className="flex flex-col gap-1">
            <p className="font-bold text-lg text-primary-highlight">Our domain name is changing!</p>
            <div className="text-base">
              <p>
                We are now located at{` `}
                <a href="https://www.steamedapples.com/?ref=applesilicongaming.com" className="underline">
                  https://www.steamedapples.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
