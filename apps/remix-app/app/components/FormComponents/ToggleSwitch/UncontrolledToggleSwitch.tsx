import { Switch } from '@headlessui/react';
import { Fragment } from 'react';

export default function ToggleSwitch({
  defaultChecked,
  name,
  label,
  labelPassive = true,
  disabled,
  onChange,
}: {
  defaultChecked: boolean;
  name?: string;
  label?: string;
  labelPassive?: boolean; // Sets if clicking the label toggles the switch
  disabled?: boolean;
  onChange?: (e: boolean) => void,
}) {
  return (
    <div>
      <Switch.Group>
        {label &&
        <div className="w-full flex justify-center">
          <Switch.Label passive={labelPassive}>
            <span className="text-primary">
              {label}
            </span>
          </Switch.Label>
        </div>
        }
        <div className="mt-1.5 mb-[2px]">
          <Switch
            defaultChecked={defaultChecked}
            name={name}
            onChange={onChange}
            as={Fragment}
          >
            {({ checked }) => (
              <button
                disabled={disabled}
                className={`${checked ? 'bg-secondary' : 'bg-primary'}
                         relative inline-flex items-center h-[38px] w-[74px] shrink-0 cursor-pointer
                         rounded-full border-2 border-transparent transition-colors duration-200
                         ease-in-out focus:outline-none focus-visible:ring-2
                         focus-visible:ring-secondary focus-visible:ring-opacity-75`}
              >
                <span
                  aria-hidden="true"
                  className={`${checked ? 'translate-x-[38px] bg-primary-text-highlight' : 'translate-x-[4px] bg-primary-text'}
                            pointer-events-none inline-block h-[30px] w-[30px] transform rounded-full
                            shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </button>

            )}
          </Switch>
        </div>
      </Switch.Group>
    </div>
  );
}