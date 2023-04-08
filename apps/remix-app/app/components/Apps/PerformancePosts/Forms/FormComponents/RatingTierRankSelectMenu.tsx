import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import type { RatingTierRank } from '~/types';
import { convertRatingTierRankToFullText } from '~/lib/conversions/rating-conversions';

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
  name,
  defaultValue,
  fieldError,
}: {
  name: string;
  defaultValue?: RatingTierRank;
  fieldError?: string;
}) {
  return (
    <SelectMenu
      name={name}
      defaultValue={defaultValue ? {
        name: convertRatingTierRankToFullText(defaultValue),
        value: defaultValue,
      } : { value: 'None', name: 'None' }}
      options={steamAppRatingOptions}
      labelText="Tier Rank"
      required
      fieldError={fieldError}
    />
  );
}
