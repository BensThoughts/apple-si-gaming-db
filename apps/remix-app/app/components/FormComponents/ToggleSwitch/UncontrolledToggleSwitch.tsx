import { Switch } from '@headlessui/react';
import { Fragment } from 'react';
// import { AppleIcon } from '~/components/Icons';

export default function ToggleSwitch({
  defaultChecked,
  name,
  label,
  labelPosition = 'top',
  labelPassive = true,
  disabled,
  onChange,
}: {
  defaultChecked: boolean;
  name?: string;
  label?: string;
  labelPosition?: 'top' | 'left' | 'right' | 'bottom';
  labelPassive?: boolean; // Sets if clicking the label toggles the switch
  disabled?: boolean;
  onChange?: (e: boolean) => void,
}) {
  let groupClassNames = '';
  let labelOrder = 'order-1';
  let switchOrder = 'order-2';
  switch (labelPosition) {
    case 'left':
      groupClassNames = 'flex gap-2 items-center justify-center';
      break;
    case 'top':
      groupClassNames = 'flex flex-col items-center justify-center';
      break;
    case 'right':
      groupClassNames = 'flex gap-2 items-center justify-center';
      labelOrder = 'order-2';
      switchOrder = 'order-1';
      break;
    case 'bottom':
      groupClassNames = 'flex flex-col items-center justify-center';
      labelOrder = 'order-2';
      switchOrder = 'order-1';
  }
  return (
    <Switch.Group as="div" className={groupClassNames}>
      {label &&
          <Switch.Label passive={labelPassive} className={labelOrder}>
            <span className="text-primary">
              {label}
            </span>
          </Switch.Label>
      }
      <div className={`mt-1.5 mb-[2px] ${switchOrder}`}>
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
                         ease-in-out focus:outline-none focus-visible:show-ring-tertiary`}
            >
              <span
                aria-hidden="true"
                className={`${checked ? 'translate-x-[38px] bg-text-primary-highlight' : 'translate-x-[4px] bg-text-primary'}
                            pointer-events-none h-[30px] w-[30px] transform rounded-full
                            shadow-lg ring-0 transition duration-200 ease-in-out inline-block`}
              />
            </button>

          )}
        </Switch>
      </div>
    </Switch.Group>
  );
}
