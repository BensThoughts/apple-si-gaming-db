// import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { FrameRateTierRank } from '~/types/remix-app';
import { convertFrameRateTierRankToDescription } from '~/lib/conversions/rating-conversions';
import { PerformancePostFormStateActions, usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';
import type { RadioGroupOption } from '~/components/HeadlessComponents/TailwindRadioGroup';
import TailwindRadioGroup from '~/components/HeadlessComponents/TailwindRadioGroup';
import { initialFrameRateTierRankSelectOption } from '../../FormContext/initialFormOptions';
// type ArrayElement<ArrayType extends readonly unknown[]> =
//   ArrayType extends readonly (infer ElementType)[] ? ElementType : never;


export type FrameRateTierRankOption = RadioGroupOption<FrameRateTierRank | 'None'>;

const frameRateOptions: FrameRateTierRankOption[] = [
  initialFrameRateTierRankSelectOption,
  {
    name: convertFrameRateTierRankToDescription('STier'),
    value: 'STier',
  },
  {
    name: convertFrameRateTierRankToDescription('ATier'),
    value: 'ATier',
  },
  {
    name: convertFrameRateTierRankToDescription('BTier'),
    value: 'BTier',
  },
  {
    name: convertFrameRateTierRankToDescription('CTier'),
    value: 'CTier',
  },
  {
    name: convertFrameRateTierRankToDescription('DTier'),
    value: 'DTier',
  },
  {
    name: convertFrameRateTierRankToDescription('FTier'),
    value: 'FTier',
  },
];

export default function FrameRateTierRankRadioGroup() {
  const { state, dispatch } = usePerformancePostFormState();
  // if (defaultFrameRateTierRank) {
  //   dispatch({ type: RatingActions.SET_FRAME_RATE_TIER_RANK, payload: defaultFrameRateTierRank });
  // }
  function onSelectionChange(selection: FrameRateTierRankOption) {
    dispatch({
      type: PerformancePostFormStateActions.SET_FRAME_RATE_TIER_RANK,
      payload: selection,
    });
  }

  return (
    <TailwindRadioGroup
      options={frameRateOptions}
      labelText="Frame Rate Tier Rank"
      value={state.frameRateTierRankSelectedOption}
      onChange={onSelectionChange}
    />
  );
}
