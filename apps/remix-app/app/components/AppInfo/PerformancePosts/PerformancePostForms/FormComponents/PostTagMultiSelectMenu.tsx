import MultiSelectMenu from '~/components/FormComponents/MultiSelectMenu';
import type { MultiSelectOption } from '~/components/FormComponents/MultiSelectMenu';

export default function PostTagMultiSelectMenu({
  formId,
  postTags,
  defaultPostTagIds,
  fieldError,
}: {
  formId: string;
  postTags: {
    postTagId: number,
    description: string,
  }[];
  defaultPostTagIds?: number[]; // defaultValue
  fieldError?: string;
}) {
  const postTagOptions: MultiSelectOption<number>[] = postTags.map((tag) => (
    {
      label: tag.description,
      value: tag.postTagId,
    }
  ));
  const defaultValue = postTagOptions.filter((option) => defaultPostTagIds?.includes(option.value));
  return (
    <MultiSelectMenu
      name="performancePostTags"
      id={`performancePostTags-${formId}`}
      labelText="Tags"
      options={postTagOptions}
      defaultValue={defaultValue}
      fieldError={fieldError}
      isMulti={true}
      closeMenuOnSelect={false}
    />
  );
}
