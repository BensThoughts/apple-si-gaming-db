// import { useContext } from 'react';
// import { ThemeContext } from '~/lib/context/colorMode';
import { Theme, useTheme } from '~/lib/context/theme-provider';

import {
  CloudMoonIcon,
  SunIcon,
} from '~/components/Icons';
import { classNames } from '~/lib/css/classNames';

export default function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  // const { colorMode, setColorMode } = useContext(ThemeContext);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };
  const inactiveColorMode = theme === Theme.DARK ? Theme.DARK : Theme.LIGHT;

  return (
    <button
      aria-label={`Change to ${inactiveColorMode} mode`}
      title={`Change to ${inactiveColorMode} mode`}
      onClick={toggleTheme}
      className="relative flex items-center justify-around text-[1.5rem] leading-none
                 w-[78px] h-[38px] p-[3px] border-0 rounded-[39px] cursor-pointer
                 bg-primary hover:bg-primary-highlight transition-colors
                 focus-visible:show-ring outline-none"
    >
      <span
        className={classNames(
            'absolute top-[3px] left-[3px] w-[32px] h-[32px] rounded-[50%]',
            'bg-secondary transition-transform',
            theme === Theme.DARK ? 'translate-x-[40px]' : 'translate-x-0',
        )}
      />
      <span aria-hidden="true">
        <CloudMoonIcon className="fill-secondary stroke-0" />
      </span>
      <span aria-hidden="true">
        <SunIcon className="fill-secondary stroke-0" />
      </span>
    </button>
  );
};
