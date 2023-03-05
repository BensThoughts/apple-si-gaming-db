import RoundedButton from '../../RoundedButton';
import MaterialInputOutlined from '~/components/FormComponents/MaterialInputOutlined';
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
  formError?: string;
  fieldErrors?: SearchFormFieldErrors;
  fields?: SearchFormFields;
  isSubmitting: boolean;
  genreOptions: MultiSelectOption<string>[];
  categoryOptions: MultiSelectOption<number>[];
} & React.InputHTMLAttributes<HTMLInputElement>

export default function SearchForm({
  genreOptions,
  categoryOptions,
  isSubmitting,
  formError,
  fieldErrors,
  fields,
  ...rest
}: SearchInputProps) {
  const formRef = useRef<HTMLFormElement>(null);

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
    <div
      className="flex flex-col gap-4 w-full max-w-xl items-center justify-center
                  bg-tertiary rounded-lg border-1 border-secondary-highlight
                  px-4 py-6 md:px-10 md:py-6"
    >
      <Form
        id={FORM_NAME}
        name={FORM_NAME}
        method="get"
        action="/search"
        ref={formRef}
        className="w-full"
      >
        <input type="hidden" name="page" value="1" className="hidden"/>
        <div className="flex flex-col items-center gap-4 w-full">
          <div className={`flex flex-col md:flex-row md:justify-between w-full justify-center items-center gap-4 md:gap-0`}>
            <MaterialInputOutlined
              name="searchQuery"
              id="searchQuery"
              label="Search Games..."
              defaultValue={fields ? fields.searchQuery : ''}
              componentSize="large"
              fieldError={fieldErrors ? fieldErrors.searchQuery : undefined}
              // minLength={2}
              maxLength={100}
              // required
              {...rest}
            />

            <div className="flex justify-between items-center w-full">
              <div className="md:w-full md:justify-self-center">
                <UncontrolledToggleSwitch
                  defaultChecked={fields ? fields.searchAppleOnly : false}
                  name="searchAppleOnly"
                  label="Apple"
                  labelPosition="left"
                />
              </div>
              <div>
                <RoundedButton
                  className={`h-[38px] md:h-[46px]`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Loading' : 'Search' }
                </RoundedButton>
              </div>

            </div>

          </div>
          <div className="flex flex-col items-start justify-center gap-4 w-full">
            <div className="w-full">
              <MultiSelectMenu
                name="searchGenreIds"
                id="searchGenreIds"
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
            <div className="w-full">
              <MultiSelectMenu
                name="searchCategoryIds"
                id="searchCategoryIds"
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

        </div>
      </Form>
    </div>
  );
}
