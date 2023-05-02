import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import { usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';
import FrameRateRatingPopover from './FrameRateRatingPopover';

export default function FrameRateRating() {
  const { state } = usePerformancePostFormState();
  return (
    <>
      <input
        type="hidden"
        name={PerformancePostFormFieldNames.FrameRateStutters}
        value={state.frameRateStuttersValue ? 'true' : 'false'}
      />
      <input
        type="hidden"
        name={PerformancePostFormFieldNames.FrameRateTierRank}
        value={state.frameRateTierRankValue}
      />
      <FrameRateRatingPopover />
    </>
  );
}