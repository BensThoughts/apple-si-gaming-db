import { Switch } from '@headlessui/react';

export default function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (e: boolean) => void,
}) {
  // const [enabled, setEnabled] = useState(false);

  return (
    <div>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={`${enabled ? 'bg-secondary' : 'bg-primary'}
          relative inline-flex items-center h-[38px] w-[74px] shrink-0 cursor-pointer
          rounded-full border-2 border-transparent transition-colors duration-200
          ease-in-out focus:outline-none focus-visible:ring-2
          focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Filter Apple Only Games</span>
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-[38px]' : 'translate-x-[4px]'}
            pointer-events-none inline-block h-[30px] w-[30px] transform rounded-full
            bg-primary-text-faded shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
}
