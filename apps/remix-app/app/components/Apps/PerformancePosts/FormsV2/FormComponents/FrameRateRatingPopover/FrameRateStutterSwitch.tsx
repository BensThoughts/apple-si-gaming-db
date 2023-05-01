import { Switch } from '@headlessui/react';
import { Fragment } from 'react';
import { classNames } from '~/lib/css/classNames';
import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import { RatingActions, usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';

export default function FrameRateStutterSwitch({
  defaultChecked = false,
}: {
  defaultChecked?: boolean;
}) {
  const { state, dispatch } = usePerformancePostFormState();
  return (
    <Switch.Group
      as="fieldset"
      className="flex items-center gap-2 group"
    >
      <Switch.Label>
        Stutters
      </Switch.Label>
      <Switch
        // defaultChecked={state.frameRateStutters ? state.frameRateStutters :
        // defaultChecked}
        checked={state.frameRateStutters}
        name={PerformancePostFormFieldNames.FrameRateStutters}
        as={Fragment}
        onChange={(checked) => {
          dispatch({ type: RatingActions.SET_FRAME_RATE_STUTTERS, payload: checked });
        }}
      >
        {({ checked }) => (
          <button
            type="button"
            className={classNames(
                'relative inline-flex items-center h-[38px] w-[74px] shrink-0 cursor-pointer',
                'rounded-full transition-colors duration-200',
                'ease-in-out focus:outline-none focus-visible:show-ring-tertiary',
                'border-1 border-secondary-highlight',
                  checked ? 'bg-secondary' : 'bg-primary',
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                  'pointer-events-none h-[30px] w-[30px] transform rounded-full',
                  'shadow-lg ring-0 transition duration-200 ease-in-out inline-block',
                    checked
                      ? 'translate-x-[38px] bg-text-primary-highlight'
                      : 'translate-x-[4px] bg-text-primary',
              )}
            />
          </button>
        )}
      </Switch>
    </Switch.Group>
  );
}
