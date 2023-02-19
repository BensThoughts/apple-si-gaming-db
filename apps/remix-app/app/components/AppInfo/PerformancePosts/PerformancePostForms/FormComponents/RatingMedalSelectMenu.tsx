import SelectMenu from '~/components/FormComponents/SelectMenu';
import type { SelectOption } from '~/components/FormComponents/SelectMenu';
import type { RatingMedal } from '~/interfaces';
import { convertRatingMedalToFullText } from '~/lib/conversions/rating-conversions';

// type ArrayElement<ArrayType extends readonly unknown[]> =
//   ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const steamAppRatingOptions: SelectOption<RatingMedal | 'None'>[] = [
  {
    name: 'None',
    value: 'None',
  },
  {
    name: convertRatingMedalToFullText('Platinum'),
    value: 'Platinum',
  },
  {
    name: convertRatingMedalToFullText('Gold'),
    value: 'Gold',
  },
  {
    name: convertRatingMedalToFullText('Silver'),
    value: 'Silver',
  },
  {
    name: convertRatingMedalToFullText('Bronze'),
    value: 'Bronze',
  },
  {
    name: convertRatingMedalToFullText('Borked'),
    value: 'Borked',
  },
];

export default function RatingMedalSelectMenu({
  defaultValue,
  fieldError,
}: {
  defaultValue?: RatingMedal;
  fieldError?: string;
}) {
  return (
    <SelectMenu
      name="performancePostRatingMedal"
      defaultValue={defaultValue ? {
        name: convertRatingMedalToFullText(defaultValue),
        value: defaultValue,
      } : { value: 'None', name: 'None' }}
      options={steamAppRatingOptions}
      labelText="Rating"
      required
      fieldError={fieldError}
    />
  );
}
