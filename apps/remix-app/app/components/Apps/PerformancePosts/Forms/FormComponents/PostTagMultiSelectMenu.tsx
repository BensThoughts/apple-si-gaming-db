import MultiSelectMenu from '~/components/FormComponents/MultiSelectMenu';
import type { MultiSelectOption } from '~/components/FormComponents/MultiSelectMenu';
import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import { PerformancePostFormStateActions, usePerformancePostFormState } from '../FormContext/PerformancePostFormContext';
import type { ActionMeta } from 'react-select';

export type PostTagMultiSelectOption = MultiSelectOption<number>;

function isTypePostTagMultiSelectOptionArray(option: unknown): option is PostTagMultiSelectOption[] {
  if (!Array.isArray(option)) {
    return false;
  }
  const everyIsPostTagMultiSelectOption = option.every((option) => {
    if (
      typeof option.label === 'string' &&
      typeof option.value === 'number'
    ) {
      return true;
    }
    return false;
  });
  if (everyIsPostTagMultiSelectOption) {
    return true;
  }
  return false;
}

export default function PostTagMultiSelectMenu({
  formId,
  postTagOptions,
  // defaultPostTagIds,
}: {
  formId: string;
  postTagOptions: PostTagMultiSelectOption[];
}) {
  const { state, dispatch } = usePerformancePostFormState();

  const onSelectionChange = (newValue: unknown, actionMeta: ActionMeta<unknown>) => {
    if (isTypePostTagMultiSelectOptionArray(newValue)) {
      dispatch({
        type: PerformancePostFormStateActions.SET_POST_TAG_MULTI_SELECT,
        payload: newValue,
      });
    }
  };

  return (
    <MultiSelectMenu
      name={PerformancePostFormFieldNames.PostTagIds}
      id={`${PerformancePostFormFieldNames.PostTagIds}-${formId}`}
      // labelText="Tags"
      options={postTagOptions}
      // defaultValue={defaultValue}
      value={state.postTagMultiSelectOption}
      onChange={onSelectionChange}
      closeMenuOnSelect={false}
      placeholderText="Tags..."
    />
  );
}
