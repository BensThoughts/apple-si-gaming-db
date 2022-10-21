import RoundedButton from '../../RoundedButton';
import Input from '~/components/FormComponents/Input';
import { Form } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { showToast } from '~/components/Toasts';
import UncontrolledToggleSwitch from '~/components/FormComponents/ToggleSwitch/UncontrolledToggleSwitch';
import MultiSelectMenu from '~/components/FormComponents/MultiSelectMenu';
import type { MultiSelectOption } from '~/components/FormComponents/MultiSelectMenu';
import type {
  SearchFormFieldErrors,
  SearchFormFields,
} from '~/routes/search/index';

const FORM_NAME = 'game-search-form';

type SearchInputProps = {
  componentSize: 'large' | 'small';
  formError?: string;
  fieldErrors?: SearchFormFieldErrors;
  fields?: SearchFormFields;
  isSubmitting: boolean;
  genreOptions: MultiSelectOption<string>[];
  categoryOptions: MultiSelectOption<number>[];
} & React.InputHTMLAttributes<HTMLInputElement>

export default function SearchInputForm({
  genreOptions,
  categoryOptions,
  isSubmitting,
  formError,
  fieldErrors,
  fields,
  componentSize = 'large',
  ...rest
}: SearchInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  let buttonHeight = 'h-[46px]';
  if (componentSize === 'small') {
    buttonHeight = 'h-[38px]';
  }

  let defaultGenreOptions: MultiSelectOption<string>[] | undefined = undefined;
  let defaultCategoryOptions: MultiSelectOption<number>[] | undefined = undefined;
  if (fields && fields.searchGenreIds) {
    const genreIds = fields.searchGenreIds;
    defaultGenreOptions = genreOptions.filter((genreOption) => genreIds.includes(genreOption.value));
  }
  if (fields && fields.searchCategoryIds) {
    const categoryIds = fields.searchCategoryIds;
    defaultCategoryOptions = categoryOptions.filter((categoryOption) => categoryIds.includes(categoryOption.value));
  }
  // TODO: showToast doesn't seem to appear when inside useEffect
  // TODO: it appears twice when not in useEffect fieldErrors vs formError
  if (formError) {
    showToast.error(formError);
  }

  useEffect(() => {
    if (fieldErrors?.searchQuery) {
      showToast.error(fieldErrors.searchQuery);
    }
  }, [fieldErrors]);

  useEffect(() => {
    if (isSubmitting) {
      formRef.current?.reset();
    }
  }, [isSubmitting]);

  return (
    <Form
      id={FORM_NAME}
      name={FORM_NAME}
      method="get"
      action="/search"
      ref={formRef}
    >
      <div className="flex flex-col gap-4">
        <div className={`flex justify-center items-center gap-2`}>
          <input type="hidden" name="page" value="1" />
          <Input
            name="searchQuery"
            id="searchQuery"
            label="Search Games..."
            defaultValue={fields ? fields.searchQuery : ''}
            componentSize={componentSize}
            fieldError={fieldErrors ? fieldErrors.searchQuery : undefined}
            // minLength={2}
            maxLength={100}
            // required
            {...rest}
          />
          <RoundedButton
            className={`${buttonHeight} w-[89.66px]`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading' : 'Search' }
          </RoundedButton>
        </div>
        <div className="flex items-center gap-4">
          <UncontrolledToggleSwitch
            defaultChecked={fields ? fields.searchAppleOnly : false}
            name="searchAppleOnly"
            label="Apple"
          />
        </div>
        <div>
          <MultiSelectMenu
            name="searchGenreIds"
            labelText="Genres"
            options={genreOptions}
            defaultValue={defaultGenreOptions}
            fieldError={fieldErrors?.searchGenreIds}
            // defaultValue={fields ? fields.searchGenreIds : undefined}
            openMenuOnFocus={false}
            closeMenuOnSelect={true}
            isMulti
          />
        </div>
        <div>
          <MultiSelectMenu
            name="searchCategoryIds"
            labelText="Categories"
            options={categoryOptions}
            defaultValue={defaultCategoryOptions}
            fieldError={fieldErrors?.searchCategoryIds}
            // defaultValue={fields ? fields.searchCategoryIds : undefined}
            openMenuOnFocus={false}
            closeMenuOnSelect={true}
            isMulti
          />
        </div>
      </div>

      {(fieldErrors && fieldErrors.searchQuery) ? (
        <div className="text-color-error">
          {fieldErrors.searchQuery}
        </div>
      ) : (
        null
      )}
    </Form>
  );
}
