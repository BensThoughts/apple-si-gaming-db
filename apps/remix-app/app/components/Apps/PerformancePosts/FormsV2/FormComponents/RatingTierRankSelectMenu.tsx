// import SelectMenu from '~/components/FormComponents/SelectMenu';
import SelectMenuWithIcon from '~/components/FormComponents/SelectMenuWithIcon';
import type { SelectOption } from '~/components/FormComponents/SelectMenuWithIcon';
import type { RatingTierRank } from '~/types';
import { convertRatingTierRankToFullText } from '~/lib/conversions/rating-conversions';
import { AwardIcon } from '~/components/Icons/FeatherIcons';
import { RatingActions, useFormRatingState } from '../FormContext';
import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';

// type ArrayElement<ArrayType extends readonly unknown[]> =
//   ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const steamAppRatingOptions: SelectOption<RatingTierRank | 'None'>[] = [
  {
    name: 'None',
    value: 'None',
  },
  {
    name: convertRatingTierRankToFullText('STier'),
    value: 'STier',
  },
  {
    name: convertRatingTierRankToFullText('ATier'),
    value: 'ATier',
  },
  {
    name: convertRatingTierRankToFullText('BTier'),
    value: 'BTier',
  },
  {
    name: convertRatingTierRankToFullText('CTier'),
    value: 'CTier',
  },
  {
    name: convertRatingTierRankToFullText('DTier'),
    value: 'DTier',
  },
  {
    name: convertRatingTierRankToFullText('ETier'),
    value: 'ETier',
  },
  {
    name: convertRatingTierRankToFullText('FTier'),
    value: 'FTier',
  },

];

export default function RatingTierRankSelectMenu({
  defaultValue,
}: {
  defaultValue?: RatingTierRank;
}) {
  const { dispatch } = useFormRatingState();
  function onSelectionChange(selection: SelectOption<RatingTierRank | 'None'>) {
    if (selection.value != 'None') {
      dispatch({ type: RatingActions.SET_RATING_TIER_RANK, payload: selection.value });
    } else {
      dispatch({ type: RatingActions.SET_RATING_TIER_RANK, payload: undefined });
    }
  }
  return (
    <div className="flex gap-2">
      <SelectMenuWithIcon
        name={PerformancePostFormFieldNames.RatingTierRank}
        defaultValue={defaultValue ? {
          name: convertRatingTierRankToFullText(defaultValue),
          value: defaultValue,
        } : steamAppRatingOptions[0]}
        options={steamAppRatingOptions}
        labelText="Tier Rank"
        PrimaryIcon={AwardIcon}
        onChange={onSelectionChange}
      />
    </div>
  );
}
