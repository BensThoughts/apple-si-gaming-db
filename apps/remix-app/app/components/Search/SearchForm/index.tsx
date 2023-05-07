import RoundedButton from '~/components/Buttons/RoundedButton';
import MaterialInputOutlined from '~/components/FormComponents/MaterialInputOutlined';
import { Form } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { showToast } from '~/components/Toasts';
import ToggleSwitchUncontrolled from '~/components/FormComponents/ToggleSwitchUncontrolled';
import MultiSelectMenu from '~/components/FormComponents/MultiSelectMenu';
import type { MultiSelectOption } from '~/components/FormComponents/MultiSelectMenu';
import type {
  SearchFormState,
} from '~/routes/search/index';
import { SearchFormURLParams } from '~/lib/enums/URLSearchParams/Search';

const FORM_NAME = 'game-search-form';

type SearchInputProps = {
  formState?: SearchFormState
  isSubmitting: boolean;
  genreOptions: MultiSelectOption<string>[];
  categoryOptions: MultiSelectOption<number>[];
} & React.InputHTMLAttributes<HTMLInputElement>

export default function SearchForm({
  genreOptions,
  categoryOptions,
  isSubmitting,
  formState,
  ...rest
}: SearchInputProps) {
  const {
    formError,
    fieldErrors,
    fields,
  } = formState ? formState : { formError: undefined, fieldErrors: undefined, fields: undefined };
  const formRef = useRef<HTMLFormElement>(null);

  let defaultGenreOptions: MultiSelectOption<string>[] | undefined = undefined;
  let defaultCategoryOptions: MultiSelectOption<number>[] | undefined = undefined;
  if (fields && fields.genreIds) {
    const genreIds = fields.genreIds;
    defaultGenreOptions =
      genreOptions.filter((genreOption) => genreIds.includes(genreOption.value));
  }
  if (fields && fields.categoryIds) {
    const categoryIds = fields.categoryIds;
    defaultCategoryOptions =
      categoryOptions.filter((categoryOption) => categoryIds.includes(categoryOption.value));
  }
  // TODO: showToast doesn't seem to appear when inside useEffect
  // TODO: it appears twice when not in useEffect fieldErrors vs formError
  // if (formError) {
  //   showToast.error(formError);
  // }


  useEffect(() => {
    if (formError) {
      showToast.error(formError);
    }
    if (fieldErrors?.appName) {
      showToast.error(fieldErrors.appName);
    }
  }, [fieldErrors, formError]);

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
        <input type="hidden" name={SearchFormURLParams.PAGE} value="1" className="hidden"/>
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex flex-col md:flex-row md:justify-between w-full
                          justify-center items-center gap-4 md:gap-0"
          >
            <MaterialInputOutlined
              name={SearchFormURLParams.APP_NAME}
              id={`${FORM_NAME}_appName`}
              label="Search Games..."
              defaultValue={fields ? fields.appName : ''}
              componentSize="large"
              fieldError={fieldErrors ? fieldErrors.appName : undefined}
              // minLength={2}
              maxLength={100}
              // required
              {...rest}
            />

            <div className="flex justify-between items-center w-full">
              <div className="md:w-full md:justify-self-center">
                <ToggleSwitchUncontrolled
                  defaultChecked={fields ? fields.appleOnly : false}
                  name={SearchFormURLParams.APPLE_ONLY}
                  label="Apple"
                  labelPosition="left"
                />
              </div>
              <div>
                <RoundedButton
                  className="h-[38px] md:h-[46px]"
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
                name={SearchFormURLParams.GENRE_IDS}
                id={`${FORM_NAME}_genreIds`}
                labelText="Genres"
                options={genreOptions}
                defaultValue={defaultGenreOptions}
                fieldError={fieldErrors?.genreIds}
                // defaultValue={fields ? fields.searchGenreIds : undefined}
                openMenuOnFocus={false}
                closeMenuOnSelect={true}
              />
            </div>
            <div className="w-full">
              <MultiSelectMenu
                name={SearchFormURLParams.CATEGORY_IDS}
                id={`${FORM_NAME}_categoryIds`}
                labelText="Categories"
                options={categoryOptions}
                defaultValue={defaultCategoryOptions}
                fieldError={fieldErrors?.categoryIds}
                // defaultValue={fields ? fields.searchCategoryIds : undefined}
                openMenuOnFocus={false}
                closeMenuOnSelect={true}
              />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
