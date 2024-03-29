import { Switch } from '@headlessui/react';
import { classNames } from '~/lib/css/classNames';

export default function ToggleSwitch({
  checked,
  name,
  label,
  labelPassive = true,
  disabled,
  onChange,
}: {
  checked: boolean;
  name?: string;
  label?: string;
  labelPassive?: boolean; // Sets if clicking the label toggles the switch
  disabled?: boolean;
  onChange: (e: boolean) => void,
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
            checked={checked}
            disabled={disabled}
            name={name}
            onChange={onChange}
            className={classNames(
                'relative inline-flex items-center h-[38px] w-[74px] shrink-0 cursor-pointer',
                'rounded-full border-2 border-transparent transition-colors duration-200',
                'ease-in-out focus:outline-none focus-visible:show-ring-tertiary',
                checked ? 'bg-secondary' : 'bg-primary',
            )}
          >
            {/* <span className="sr-only">Filter Apple Only Games</span> */}
            <span
              aria-hidden="true"
              className={classNames(
                  'pointer-events-none inline-block h-[30px] w-[30px] transform rounded-full',
                  'shadow-lg ring-0 transition duration-200 ease-in-out',
                  checked
                    ? 'translate-x-[38px] bg-text-primary-highlight'
                    : 'translate-x-[4px] bg-text-primary',
              )}
            />
          </Switch>
        </div>
      </Switch.Group>
    </div>
  );
}
