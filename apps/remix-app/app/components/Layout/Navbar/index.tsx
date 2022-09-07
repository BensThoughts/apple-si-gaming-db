import { useState } from 'react';

import ThemeToggle from '~/components/ThemeToggle';
import MenuDrawer from '~/components/Layout/MenuDrawer';
import IconButton from '~/components/IconButton';
import MenuItem from './MenuItem';
import NavHider from './NavHider';

import { menuItems } from './menuItems';

import {
  AppleIcon,
  BarsIcon,
  SteamIcon,
} from '~/components/Icons';
import SearchInput from '~/components/SearchInput';
import { Link } from '@remix-run/react';

// bg-app-bg shadow-lg backdrop-filter bg-opacity-70 backdrop-blur-sm

type NavBarProps = {
  className?: string;
  authState: boolean;
}

export default function Navbar({
  className,
  authState,
  ...rest
}: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  // const authState = useSelector(selectSteamUserAuthIsLoggedIn);


  return (
    <>
      <MenuDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="Menu">
        <div className="flex flex-col justify-end content-between items-center pt-0 mt-7 w-full">
          {menuItems.map((menuItem) => (
            <MenuItem
              key={menuItem.href}
              href={menuItem.href}
              onClick={() => setIsOpen(false)}
              className="flex justify-center items-center w-full h-10 text-xl hover:bg-primary"
            >
              {menuItem.name}
            </MenuItem>
          ))}
        </div>
      </MenuDrawer>
      <NavHider>
        <nav {...rest} className={`bg-opacity-70 shadow-lg bg-app-bg z-[49]
                                   flex items-center justify-between w-full p-0 transition-colors ${className}`}>

          {/* Medium+ Screens */}
          <div className="hidden md:flex md:justify-between md:items-center md:w-full md:pt-0 md:mx-3">
            <div className="flex gap-x-4 items-center">
              <AppleIcon size={26} className="text-icon-secondary" />
              <div className="flex gap-4 content-between items-center pt-0">
                {menuItems.map((menuItem) => (
                  <MenuItem animatedLink key={menuItem.href} href={menuItem.href}>{menuItem.name}</MenuItem>
                ))}
                <SearchInput size="medium" />

              </div>
            </div>
            <div className="flex gap-x-4 justify-end items-center">
              <ThemeToggle />
              <span>{authState ? 'Logged In' : 'Logged Out'}</span>
              <Link to="/profile">
                <div className="block rounded-md h-[40px] w-[40px] bg-primary hover:bg-primary-highlight p-px group">
                  <SteamIcon className="text-icon-secondary rounded-md w-full h-full group-hover:text-icon-secondary-highlight" />
                </div>
              </Link>
            </div>
          </div>

          {/* Small- Screens */}
          <div className="flex justify-between items-center mx-3 w-full md:hidden">

            <ThemeToggle />
            <IconButton onClick={() => setIsOpen(!isOpen)} className="mr-3 md:hidden" aria-label="navigation menu">
              <BarsIcon size={24} className="text-icon-primary" />
            </IconButton>

          </div>
        </nav>
      </NavHider>

    </>
  );
};
