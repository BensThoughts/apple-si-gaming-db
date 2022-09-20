import RoundedButton from '../../RoundedButton';
import FloatingLabelInput from './FloatingLabelInput';
import { Form, useTransition } from '@remix-run/react';

const FORM_NAME = 'game-search-form';

interface SearchInputProps {
  size: 'large' | 'medium';
}

export default function SearchInput({
  size = 'large',
}: SearchInputProps) {
  let buttonHeight = 'max-h-[46px]';
  if (size === 'medium') {
    buttonHeight = 'max-h-[38px]';
  }

  const transition = useTransition();
  const transitionState = transition.state;
  const transitioning = transitionState === 'submitting' || transitionState === 'loading';

  return (
    <Form
      id={FORM_NAME}
      name={FORM_NAME}
      method="get"
      action="/search"
    >
      <div className="flex justify-center items-center gap-2">
        <div>
          <FloatingLabelInput
            name="searchQuery"
            id="searchQuery"
            label="Search Games..."
            inputSize={size}
          />
        </div>
        <RoundedButton
          className={`${buttonHeight} max-w-[89.66px]
                      ${transitioning ? 'bg-primary-highlight hover:bg-primary-highlight' : 'bg-secondary'}
                    `}
          type="submit"
          disabled={transitioning}
        >
          {transitioning ? 'Loading' : 'Search' }
        </RoundedButton>
      </div>
    </Form>
  );
}
