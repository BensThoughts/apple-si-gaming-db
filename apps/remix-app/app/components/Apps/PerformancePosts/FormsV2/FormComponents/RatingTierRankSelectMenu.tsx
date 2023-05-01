// import SelectMenu from '~/components/FormComponents/SelectMenu';
import SelectMenuWithIcon from '~/components/FormComponents/SelectMenuWithIcon';
import type { SelectOption } from '~/components/FormComponents/SelectMenuWithIcon';
import type { RatingTierRank } from '~/types';
import { convertRatingTierRankToFullText } from '~/lib/conversions/rating-conversions';
import { AwardIcon } from '~/components/Icons/FeatherIcons';
import { PerformancePostFormStateActions, usePerformancePostFormState } from '../FormContext/PerformancePostFormContext';
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
  defaultRatingTierRank,
}: {
  defaultRatingTierRank?: RatingTierRank;
}) {
  const { dispatch } = usePerformancePostFormState();
  function onSelectionChange(selection: SelectOption<RatingTierRank | 'None'>) {
    if (selection.value != 'None') {
      dispatch({
        type: PerformancePostFormStateActions.SET_RATING_TIER_RANK,
        payload: selection.value
      });
    } else {
      dispatch({
        type: PerformancePostFormStateActions.SET_RATING_TIER_RANK,
        payload: undefined
      });
    }
  }

  const defaultValue = steamAppRatingOptions.find((option) => option.value === defaultRatingTierRank);
  return (
    <div className="flex gap-2">
      <SelectMenuWithIcon
        name={PerformancePostFormFieldNames.RatingTierRank}
        defaultValue={defaultValue ? defaultValue : steamAppRatingOptions[0]}
        options={steamAppRatingOptions}
        labelText="Tier Rank"
        PrimaryIcon={AwardIcon}
        onChange={onSelectionChange}
      />
    </div>
  );
}
