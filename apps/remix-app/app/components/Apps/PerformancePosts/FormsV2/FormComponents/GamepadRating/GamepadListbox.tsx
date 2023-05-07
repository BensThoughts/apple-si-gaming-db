import type { GamepadOption } from '~/types/remix-app';
import { PerformancePostFormStateActions, usePerformancePostFormState } from '../../FormContext/PerformancePostFormContext';
import { CheckIcon, ChevronUpIcon } from '~/components/Icons/FeatherIcons';
import { Listbox, Transition } from '@headlessui/react';
import { classNames } from '~/lib/css/classNames';
import { initialGamepadOption } from '../../FormContext/initialFormOptions';

export type GamepadListboxOption = {
  name: string;
  value: number;
}

export default function GamepadListbox({
  gamepads,
  // defaultGamepadId,
}: {
  gamepads: GamepadOption[];
  // defaultGamepadId?: number; // defaultValue
}) {
  const { state, dispatch } = usePerformancePostFormState();

  const gamepadOptions: GamepadListboxOption[] = gamepads.map((gamepad) => (
    {
      name: gamepad.description,
      value: gamepad.id,
    }
  ));
  gamepadOptions.unshift(initialGamepadOption);

  function onSelectionChange(selection: GamepadListboxOption) {
    dispatch({
      type: PerformancePostFormStateActions.SET_GAMEPAD_OPTION,
      payload: {
        name: selection.name,
        value: selection.value,
      },
    });
  }

  // const defaultValue = gamepadOptions.find((option) => option.value === state.gamepadValue);

  return (
    <Listbox
      value={state.gamepadSelectedOption}
      onChange={onSelectionChange}
    >
      <div className="flex flex-col gap-2">
        {/* <Listbox.Label className="flex w-full bg-primary-highlight px-3 py-2">
          Select Gamepad
        </Listbox.Label> */}
        {/* TODO: Should we be setting width here with w- (or in each component individually with max-w) */}
        <div className="relative">
          <Listbox.Button
            className="relative py-2 pr-10 pl-3 w-full max-w-xs text-left rounded-md
                       cursor-pointer bg-primary hover:bg-primary-highlight
                       focus-visible:show-ring-tertiary border-1
                       border-secondary-highlight"
          >
            {({ value }: { value?: GamepadListboxOption }) => (
              <>
                <span className="flex gap-2 items-center pointer-events-none">
                  {value && value.name}
                  {/* <AwardIcon /> */}
                  <span className="flex absolute inset-y-0 right-0 items-center pr-2 pointer-events-none">

                    <ChevronUpIcon
                      className="rotate-180 w-5 h-5 text-gray-400 pr-2 border-r-1 border-r-secondary-highlight"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </>
            )}

          </Listbox.Button>
          <Transition
            as="div"
            leave="transition ease-in duration-[0ms]"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className={classNames(
                'absolute py-1 mt-0 z-[101]',
                'text-base rounded-md bg-primary',
                'sm:text-sm shadow-lg w-full',
                // 'focus-within:ring-secondary focus-within:outline-none focus-within:ring-1',
            )}
          >
            {/* <Listbox.Label
            className="sticky border-b-1 border-secondary-highlight
                       text-base text-primary-highlight flex justify-center
                       w-full pt-1 pb-2 mb-1"
          >
            {labelText}
          </Listbox.Label> */}
            <Listbox.Options
              className={classNames(
                  'overflow-auto absolute py-1 mt-1 w-full max-w-xs',
                  'text-base rounded-md bg-primary focus:outline-none',
                  'focus:ring-1 focus:ring-secondary',
                  'max-h-60 sm:max-h-fit',
                  // 'focus:ring-secondary focus:outline-none rounded-b-md',
              )}
            // className="overflow-auto absolute z-10 py-1 mt-1 sm:max-h-60
            //            text-base rounded-md bg-primary focus:outline-none
            //            focus:ring-1 focus:ring-secondary sm:text-sm w-fit"
            >

              {gamepadOptions.map((option, idx) => (
                <Listbox.Option
                  key={`${option}-${idx}`}
                  className={({ active }) => `${active ? 'text-primary-highlight bg-secondary' : 'text-primary'}
                    cursor-pointer select-none relative py-2 pl-10 pr-4
                `}
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={classNames(
                            'block truncate',
                          selected
                            ? 'font-medium text-primary-highlight'
                            : 'font-normal text-primary',
                        )}
                      >
                        {option.name}
                      </span>
                      {selected ? (
                     <span
                       className="absolute inset-y-0 left-0 flex items-center pl-3
                                  text-primary-highlight"
                     >
                       <CheckIcon className="w-5 h-5" aria-hidden="true" />
                     </span>
                    ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </div>
    </Listbox>
  );
}
