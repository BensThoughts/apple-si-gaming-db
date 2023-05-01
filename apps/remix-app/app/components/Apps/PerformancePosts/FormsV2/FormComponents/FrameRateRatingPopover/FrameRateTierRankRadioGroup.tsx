// import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { FrameRateTierRank } from '~/types';
import { convertFrameRateTierRankToDescription } from '~/lib/conversions/rating-conversions';
import { RatingActions, usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';
import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import type { RadioGroupOption } from '~/components/HeadlessComponents/TailwindRadioGroup';
import TailwindRadioGroup from '~/components/HeadlessComponents/TailwindRadioGroup';
// type ArrayElement<ArrayType extends readonly unknown[]> =
//   ArrayType extends readonly (infer ElementType)[] ? ElementType : never;


type FrameRateRadioGroupOption = RadioGroupOption<FrameRateTierRank | 'None'>;

const frameRateOptions: FrameRateRadioGroupOption[] = [
  {
    name: 'Not Sure',
    value: 'None',
  },
  {
    name: convertFrameRateTierRankToDescription('FTier'),
    value: 'FTier',
  },
  {
    name: convertFrameRateTierRankToDescription('DTier'),
    value: 'DTier',
  },
  {
    name: convertFrameRateTierRankToDescription('CTier'),
    value: 'CTier',
  },
  {
    name: convertFrameRateTierRankToDescription('BTier'),
    value: 'BTier',
  },
  {
    name: convertFrameRateTierRankToDescription('ATier'),
    value: 'ATier',
  },
  {
    name: convertFrameRateTierRankToDescription('STier'),
    value: 'STier',
  },
];

export default function FrameRateTierRankRadioGroup({
  defaultFrameRateTierRank,
}: {
  defaultFrameRateTierRank?: FrameRateTierRank;
}) {
  const { state, dispatch } = usePerformancePostFormState();
  // if (defaultFrameRateTierRank) {
  //   dispatch({ type: RatingActions.SET_FRAME_RATE_TIER_RANK, payload: defaultFrameRateTierRank });
  // }
  function onSelectionChange(selection: FrameRateRadioGroupOption) {
    if (selection.value != 'None') {
      dispatch({ type: RatingActions.SET_FRAME_RATE_TIER_RANK, payload: selection.value });
    } else {
      dispatch({ type: RatingActions.SET_FRAME_RATE_TIER_RANK, payload: undefined });
    }
  }

  const { frameRateTierRank } = state;
  const defaultValue = frameRateOptions.find((option) => option.value === frameRateTierRank);

  return (
    <TailwindRadioGroup
      name={PerformancePostFormFieldNames.RatingTierRank}
      options={frameRateOptions}
      defaultValue={defaultValue ? defaultValue : frameRateOptions[0]}
      labelText="Frame Rate Tier Rank"
      onChange={onSelectionChange}
    />
    // <RadioGroup
    //   name={PerformancePostFormFieldNames.RatingTierRank}
    //   by="value"
    //   defaultValue={defaultValue ? defaultValue : frameRateOptions[0]}
    //   onChange={onSelectionChange}
    //   as="div"
    //   className="flex flex-col gap-2 w-full max-w-[26rem]"
    // >
    //   <RadioGroup.Label
    //     as="label"
    //     className="sr-only"
    //   >
    //       Frame Rate Radio Group
    //   </RadioGroup.Label>
    //   <div className="w-full flex flex-wrap gap-2">
    //     {frameRateOptions.map((ratingOption) => (
    //       <RadioGroup.Option
    //         key={ratingOption.value}
    //         value={ratingOption}
    //         as="button"
    //         type="button"
    //         className={({ active, checked }) =>
    //           classNames(
    //               'relative flex cursor-pointer px-3 py-2 shadow-md focus:outline-none',
    //               'rounded-md',
    //               active
    //               ? 'ring-2 ring-secondary ring-opacity-60 ring-offset-2 ring-offset-secondary-highlight'
    //               : '',
    //               checked ? 'bg-tertiary-highlight text-primary' : 'bg-tertiary',
    //           )}
    //       >
    //         {({ active, checked }) => (
    //           <>
    //             <div className="flex items-center">
    //               <div className="text-sm">
    //                 <RadioGroup.Label
    //                   as="p"
    //                   className={classNames(
    //                       'select-none',
    //                       checked ? 'text-primary-highlight' : 'text-primary',
    //                   )}
    //                 >
    //                   {ratingOption.name}
    //                 </RadioGroup.Label>
    //               </div>
    //             </div>
    //             {/* {checked && (
    //               <div className="shrink-0 text-white">
    //                 <CircleDotIcon className="h-6 w-6" />
    //               </div>
    //             )} */}
    //           </>
    //         )}
    //       </RadioGroup.Option>
    //     ))}
    //   </div>
    // </RadioGroup>
  );
}
