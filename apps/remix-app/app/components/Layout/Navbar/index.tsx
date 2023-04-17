import { useState } from 'react';

import ThemeToggle from '~/components/Layout/Navbar/ThemeToggle';
import MenuDrawer from '~/components/Layout/MenuDrawer';
import NavHider from './NavHider';

import { navMenuLinks } from './navMenuLinks';

import {
  BarsIcon,
} from '~/components/Icons/FeatherIcons';
import {
  SteamIcon,
} from '~/components/Icons/FontAwesomeIcons/Solid';
import SimpleSearchForm from '~/components/Search/SimpleSearchForm';
import { NavLink } from '@remix-run/react';
import { AppleLogoSolidIcon } from '~/components/Icons/FlatIcons/Solid';
import ProfileMenu from '~/components/Layout/ProfileMenu';
import AnimatedUnderline from '~/components/AnimatedUnderline';
import { classNames } from '~/lib/css/classNames';

type NavBarProps = {
  className?: string;
  isLoggedIn: boolean;
  isSearchSubmitting: boolean;
}

export default function NavBar({
  className,
  isLoggedIn,
  isSearchSubmitting,
  ...rest
}: NavBarProps) {
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  // const authState = useSelector(selectSteamUserAuthIsLoggedIn);

  return (
    <>
      <MenuDrawer isOpen={isMainMenuOpen} setIsOpen={setIsMainMenuOpen} title="Menu">
        <div className="flex flex-col items-center w-full gap-6">
          <div className="flex flex-col justify-end content-between items-center pt-0 mt-7 w-full">
            {navMenuLinks.map((menuItem, idx) => (
              <NavLink
                key={`${menuItem.to}-${idx}`}
                to={menuItem.to}
                onClick={() => setIsMainMenuOpen(false)}
                className="flex items-center justify-center w-full h-10 text-xl text-center
                           hover:bg-primary focus:outline-none focus-visible:show-ring-app-bg rounded-sm"
              >
                {menuItem.name}
              </NavLink>
            ))}
            <NavLink
              to={'/profile'}
              onClick={() => setIsMainMenuOpen(false)}
              className="flex items-center justify-center w-full h-10 text-xl text-center
                         hover:bg-primary focus:outline-none focus-visible:show-ring-app-bg rounded-sm"
            >
              {isLoggedIn ? 'Profile' : 'Login'}
            </NavLink>
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </MenuDrawer>
      <NavHider>
        <div
          className={classNames(
              'bg-opacity-70 bg-app-bg-secondary shadow-lg z-[49] flex items-center',
              'justify-between w-full p-0 transition-colors',
              className ? className : '',
          )}
          {...rest}
        >
          {/* Medium+ Screens */}
          <div className="hidden md:flex md:justify-between md:items-center md:w-full md:pt-0 md:mx-3">
            <div className="flex gap-x-4 items-center">
              <AppleLogoSolidIcon size={34} className="fill-secondary stroke-0" />
              <div className="flex gap-3 content-between items-center pt-0">
                {navMenuLinks.map((menuItem, idx) => (
                  <NavLink
                    key={`${menuItem.to}-${idx}`}
                    to={menuItem.to}
                    className="outline-none focus-visible:show-ring-app-bg px-1 rounded-sm"
                  >
                    <AnimatedUnderline>
                      {menuItem.name}
                    </AnimatedUnderline>
                  </NavLink>
                ))}
                <NavLink
                  to={'/profile'}
                  onClick={() => setIsMainMenuOpen(false)}
                  className="focus-visible:show-ring-app-bg px-1 rounded-sm"
                >
                  <AnimatedUnderline>
                    {isLoggedIn ? 'Profile' : 'Login'}
                  </AnimatedUnderline>
                </NavLink>
                <SimpleSearchForm
                  isSubmitting={isSearchSubmitting}
                />
              </div>
            </div>
            <div className="flex gap-x-4 justify-end items-center">
              <ThemeToggle />
              <div className="hidden navBarQuery:flex gap-x-4 items-center justify-center">
                <ProfileMenu isLoggedIn={isLoggedIn} />
              </div>
            </div>
          </div>

          {/* Small- Screens */}
          <div className="flex justify-between items-center mx-3 w-full md:hidden">

            <NavLink
              to="/profile"
              className="ml-3 text-sm text-primary-highlight inline-flex justify-center items-center
                         border border-transparent font-medium rounded
                         bg-primary hover:bg-primary-highlight focus-visible:show-ring-app-bg
                         h-[40px] w-[58px]"
            >
              <SteamIcon size={40} className="fill-secondary stroke-0" />
            </NavLink>
            <button
              onClick={() => setIsMainMenuOpen(!isMainMenuOpen)}
              aria-label="navigation menu"
              className="mr-3 text-sm text-primary-highlight inline-flex justify-center items-center
                         border border-transparent font-medium px-4 py-2 rounded
                         bg-primary hover:bg-primary-highlight focus-visible:show-ring-app-bg
                         h-[40px] w-[58px]"
            >
              <BarsIcon size={24} className="fill-transparent stroke-secondary stroke-2" />
            </button>
          </div>
        </div>
      </NavHider>

    </>
  );
};
