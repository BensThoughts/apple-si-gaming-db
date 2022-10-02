import { useContext } from 'react';
import { ThemeContext } from '~/lib/context/colorMode';

import {
  CloudMoonIcon,
  SunIcon,
} from '~/components/Icons';

export default function ThemeToggle() {
  const { colorMode, setColorMode } = useContext(ThemeContext);
  const inactiveColorMode = colorMode === 'light' ? 'dark' : 'light';

  return (
    <button
      aria-label={`Change to ${inactiveColorMode} mode`}
      title={`Change to ${inactiveColorMode} mode`}
      onClick={() => setColorMode(inactiveColorMode)}
      className={`relative flex items-center justify-around text-[1.5rem] leading-none
                  w-[78px] h-[38px] p-[3px] border-0 rounded-[39px] cursor-pointer
                  bg-accent transition-colors focus-visible:show-ring`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[32px] h-[32px] rounded-[50%]
                    bg-secondary transition-transform
                    ${colorMode === 'dark' ? 'translate-x-[40px]' : 'translate-x-0'}`}
      />
      <span aria-hidden="true"><CloudMoonIcon className="text-icon-secondary" /></span>
      <span aria-hidden="true"><SunIcon className="text-icon-secondary" /></span>
    </button>
  );
};
