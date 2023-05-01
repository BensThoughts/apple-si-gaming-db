import MultiSelectMenu from '~/components/FormComponents/MultiSelectMenu';
import type { MultiSelectOption } from '~/components/FormComponents/MultiSelectMenu';
import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import type { PostTagOption } from '~/types';

export default function PostTagMultiSelectMenu({
  formId,
  postTags,
  defaultPostTagIds,
  fieldError,
}: {
  formId: string;
  postTags: PostTagOption[];
  defaultPostTagIds?: number[]; // defaultValue
  fieldError?: string;
}) {
  const postTagOptions: MultiSelectOption<number>[] = postTags.map((tag) => (
    {
      label: tag.description,
      value: tag.id,
    }
  ));
  const defaultValue = postTagOptions.filter((option) => defaultPostTagIds?.includes(option.value));
  return (
    <MultiSelectMenu
      name={PerformancePostFormFieldNames.PostTagIds}
      id={`${PerformancePostFormFieldNames.PostTagIds}-${formId}`}
      // labelText="Tags"
      options={postTagOptions}
      defaultValue={defaultValue}
      fieldError={fieldError}
      isMulti={true}
      closeMenuOnSelect={false}
      placeholderText="Tags..."
    />
  );
}
