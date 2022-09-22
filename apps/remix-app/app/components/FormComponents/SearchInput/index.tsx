import RoundedButton from '../../RoundedButton';
import FloatingLabelInput from './FloatingLabelInput';
import { Form, useTransition } from '@remix-run/react';

const FORM_NAME = 'game-search-form';

type SearchInputProps = {
  componentSize: 'large' | 'medium';
  fieldError?: string;
} & React.InputHTMLAttributes<HTMLInputElement>

export default function SearchInput({
  defaultValue,
  minLength = 1,
  maxLength = 100,
  required = true,
  fieldError,
  componentSize = 'large',
}: SearchInputProps) {
  let buttonHeight = 'h-[46px]';
  if (componentSize === 'medium') {
    buttonHeight = 'h-[38px]';
  }

  const transition = useTransition();
  const transitionState = transition.state;
  const isSearchLocation = transition.location?.pathname === '/search' ? true : false;
  const transitioning = (
    (transitionState === 'submitting') &&
    isSearchLocation
  ) || (
    (transitionState === 'loading') &&
    isSearchLocation
  );

  return (
    <Form
      id={FORM_NAME}
      name={FORM_NAME}
      method="get"
      action="/search"
    >
      <div className={`flex justify-center items-center gap-2`}>
        <div>
          <FloatingLabelInput
            name="searchQuery"
            id="searchQuery"
            defaultValue={defaultValue}
            label="Search Games..."
            componentSize={componentSize}
            minLength={minLength}
            maxLength={maxLength}
            required={required}
            fieldError={fieldError}
          />
        </div>
        <RoundedButton
          className={`${buttonHeight} w-[89.66px]
                      ${transitioning ? 'bg-primary-highlight hover:bg-primary-highlight' : 'bg-secondary'}
                    `}
          type="submit"
          disabled={transitioning}
        >
          {transitioning ? 'Loading' : 'Search' }
        </RoundedButton>
      </div>
      {fieldError ? <div className="text-color-error">{fieldError}</div> : null}
    </Form>
  );
}
