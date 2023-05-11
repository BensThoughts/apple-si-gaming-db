// import SelectMenu from '~/components/FormComponents/SelectMenu';
import SelectMenuWithIcon from '~/components/FormComponents/SelectMenuWithIcon';
import type { SelectOption } from '~/components/FormComponents/SelectMenuWithIcon';
import type { RatingTierRank } from '~/types/remix-app';
import { convertRatingTierRankToFullText } from '~/lib/conversions/rating-conversions';
import { AwardIcon } from '~/components/Icons/FeatherIcons';
import { PerformancePostFormStateActions, usePerformancePostFormState } from '../FormContext/PerformancePostFormContext';
import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import { initialRatingTierRankSelectOption } from '../FormContext/initialFormOptions';

export type RatingTierRankSelectOption = SelectOption<RatingTierRank | 'None'>;

export const ratingTierRankOptions: RatingTierRankSelectOption[] = [
  initialRatingTierRankSelectOption,
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

export default function RatingTierRankSelectMenu() {
  const { state, dispatch } = usePerformancePostFormState();

  function onSelectionChange(selection: RatingTierRankSelectOption) {
    dispatch({
      type: PerformancePostFormStateActions.SET_RATING_TIER_RANK,
      payload: selection,
    });
  }

  return (
    <div className="flex gap-2">
      <SelectMenuWithIcon
        name={PerformancePostFormFieldNames.RatingTierRank}
        value={state.ratingTierRankSelectedOption}
        options={ratingTierRankOptions}
        labelText="Rank"
        PrimaryIcon={AwardIcon}
        onChange={onSelectionChange}
      />
    </div>
  );
}
