import { useState } from 'react';

import ThemeToggle from '~/components/ThemeToggle';
import MenuDrawer from '~/components/Layout/MenuDrawer';
import MenuItem from './MenuItem';
import NavHider from './NavHider';

import { menuItems } from './menuItems';

import {
  AppleIcon,
  BarsIcon,
  SteamIcon,
} from '~/components/Icons';
import SearchInputForm from '~/components/Search/SearchInputForm';
import { Link } from '@remix-run/react';

// bg-app-bg shadow-lg backdrop-filter bg-opacity-70 backdrop-blur-sm

type NavBarProps = {
  className?: string;
  isLoggedIn: boolean;
  isSearchSubmitting: boolean;
}

export default function Navbar({
  className,
  isLoggedIn,
  isSearchSubmitting,
  ...rest
}: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  // const authState = useSelector(selectSteamUserAuthIsLoggedIn);


  return (
    <>
      <MenuDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="Menu">
        <div className="flex flex-col items-center w-full gap-6">
          <div className="flex flex-col justify-end content-between items-center pt-0 mt-7 w-full">
            {menuItems.map((menuItem) => (
              <Link
                key={menuItem.href}
                to={menuItem.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full h-10 text-xl text-center hover:bg-primary"
              >
                {menuItem.name}
              </Link>
            ))}
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </MenuDrawer>
      <NavHider>
        <nav {...rest} className={`bg-opacity-70 bg-app-bg-secondary shadow-lg z-[49] flex items-center
                                   justify-between w-full p-0 transition-colors ${className}`}>

          {/* Medium+ Screens */}
          <div className="hidden md:flex md:justify-between md:items-center md:w-full md:pt-0 md:mx-3">
            <div className="flex gap-x-4 items-center">
              <AppleIcon size={26} className="text-icon-secondary" />
              <div className="flex gap-4 content-between items-center pt-0">
                {menuItems.map((menuItem) => (
                  <MenuItem animatedLink key={menuItem.href} href={menuItem.href}>{menuItem.name}</MenuItem>
                ))}
                <SearchInputForm
                  componentSize="medium"
                  isSubmitting={isSearchSubmitting}
                />

              </div>
            </div>
            <div className="flex gap-x-4 justify-end items-center">
              <ThemeToggle />
              <span>{isLoggedIn ? 'Logged In' : 'Logged Out'}</span>
              <Link to="/profile" className="focus-visible:show-ring block rounded-md h-[40px] w-[40px] bg-primary hover:bg-primary-highlight p-px group">
                <SteamIcon className="text-icon-secondary rounded-md w-full h-full group-hover:text-icon-secondary-highlight" />
              </Link>
            </div>
          </div>

          {/* Small- Screens */}
          <div className="flex justify-between items-center mx-3 w-full md:hidden">

            <Link
              to="/profile"
              className={`ml-3 text-sm text-primary-highlight inline-flex justify-center items-center
                          border border-transparent font-medium rounded
                          bg-secondary hover:bg-secondary-highlight focus-visible:show-ring
                          h-[40px] w-[58px]`}
            >
              <SteamIcon size={40} className="text-primary-highlight" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="navigation menu"
              className={`mr-3 text-sm text-primary-highlight inline-flex justify-center items-center
                          border border-transparent font-medium px-4 py-2 rounded
                          bg-secondary hover:bg-secondary-highlight focus-visible:show-ring
                          h-[40px] w-[58px]`}
            >
              <BarsIcon size={24} className="text-primary-highlight" />
            </button>
          </div>
        </nav>
      </NavHider>

    </>
  );
};
