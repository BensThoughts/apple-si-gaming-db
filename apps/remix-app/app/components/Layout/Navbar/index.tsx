import { useState } from 'react';

import ThemeToggle from '~/components/Layout/Navbar/ThemeToggle';
import MenuDrawer from '~/components/Layout/MenuDrawer';
import MenuItem from './MenuItem';
import NavHider from './NavHider';

import { navMenuLinks } from './navMenuLinks';

import {
  BarsIcon,
  SteamIcon,
} from '~/components/Icons';
import SimpleSearchForm from '~/components/Search/SimpleSearchForm';
import { Link } from '@remix-run/react';
import { AppleLogoSolidIcon } from '~/components/Icons/FlatIcons';
import ProfileMenu from '~/components/Layout/ProfileMenu';

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
            {navMenuLinks.map((menuItem, idx) => (
              <Link
                key={`${menuItem.to}-${idx}`}
                to={menuItem.to}
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
        <div {...rest} className={`bg-opacity-70 bg-app-bg-secondary shadow-lg z-[49] flex items-center
                                   justify-between w-full p-0 transition-colors ${className}`}>

          {/* Medium+ Screens */}
          <div className="hidden md:flex md:justify-between md:items-center md:w-full md:pt-0 md:mx-3">
            <div className="flex gap-x-4 items-center">
              <AppleLogoSolidIcon size={34} className="text-icon-secondary" />
              <div className="flex gap-3 content-between items-center pt-0">
                {navMenuLinks.map((menuItem, idx) => (
                  <MenuItem animatedLink key={`${menuItem.to}-${idx}`} href={menuItem.to}>{menuItem.name}</MenuItem>
                ))}
                <SimpleSearchForm
                  isSubmitting={isSearchSubmitting}
                />
              </div>
            </div>
            <div className="flex gap-x-4 justify-end items-center">
              <ThemeToggle />
              <div className="hidden navBarQuery:flex gap-x-4 items-center justify-center">
                <ProfileMenu isLoggedIn={isLoggedIn} />
                {/* <span>{isLoggedIn ? 'Logged In' : 'Logged Out'}</span>
                <Link to="/profile" className="block focus-visible:show-ring rounded-md h-[40px] w-[40px] bg-primary hover:bg-primary-highlight p-px group">
                  <SteamIcon className="text-icon-secondary rounded-md w-full h-full group-hover:text-icon-secondary-highlight" />
                </Link> */}
              </div>
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
        </div>
      </NavHider>

    </>
  );
};
