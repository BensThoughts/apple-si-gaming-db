import { useState } from 'react';
import { NavLink } from '@remix-run/react';
import { classNames } from '~/lib/css/classNames';
import { navMenuLinks } from './links/navMenuLinks';
import { BarsIcon } from '~/components/Icons/FeatherIcons';
import { SteamIcon } from '~/components/Icons/FontAwesomeIcons/Solid';
import { AppleLogoSolidIcon } from '~/components/Icons/FlatIcons/Solid';
import ThemeToggle from '~/components/Layout/Navbar/ThemeToggle';
import NavHider from './NavHider';
import SimpleSearchForm from '~/components/Search/SimpleSearchForm';
import AnimatedUnderline from '~/components/AnimatedUnderline';
import ProfileMenu from '~/components/Layout/Navbar/ProfileMenu';
import MainMenuDrawer from './Drawers/MainMenuDrawer';
import ProfileMenuDrawer from './Drawers/ProfileMenuDrawer';


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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  // const authState = useSelector(selectSteamUserAuthIsLoggedIn);

  return (
    <>
      <MainMenuDrawer
        isLoggedIn={isLoggedIn}
        isMainMenuOpen={isMainMenuOpen}
        setIsMainMenuOpen={setIsMainMenuOpen}
      />
      <ProfileMenuDrawer
        isLoggedIn={isLoggedIn}
        isProfileMenuOpen={isProfileMenuOpen}
        setIsProfileMenuOpen={setIsProfileMenuOpen}
      />
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
                      {menuItem.text}
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

            <button
              // to="/profile"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="ml-3 text-sm text-primary-highlight inline-flex justify-center items-center
                         border border-transparent font-medium rounded
                         bg-primary hover:bg-primary-highlight focus-visible:show-ring-app-bg
                         h-[40px] w-[58px]"
            >
              <SteamIcon size={40} className="fill-secondary stroke-0" />
            </button>
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
