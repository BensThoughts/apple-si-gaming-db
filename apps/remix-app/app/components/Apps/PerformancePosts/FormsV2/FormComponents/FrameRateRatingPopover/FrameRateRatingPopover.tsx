import { MonitorIcon } from '~/components/Icons/FeatherIcons';
import FrameRateTierRankRadioGroup from './FrameRateTierRankRadioGroup';
import FrameRateStutterSwitch from './FrameRateStutterSwitch';
import TailwindPopover from '~/components/HeadlessComponents/TailwindPopover';


export default function FrameRateRatingPopover() {
  return (
    <TailwindPopover
      buttonText="Frame Rate"
      Icon={MonitorIcon}
    >
      <div className="w-full flex flex-col gap-4 p-3">
        {/* <div className="bg-primary-highlight py-2 px-3 font-medium">
              <h3>
                Frame Rate
              </h3>
            </div> */}
        <div className="flex flex-col gap-4">
          <div className="px-1">
            <FrameRateStutterSwitch />
          </div>
          <FrameRateTierRankRadioGroup />
        </div>
      </div>
    </TailwindPopover>
  );
}
