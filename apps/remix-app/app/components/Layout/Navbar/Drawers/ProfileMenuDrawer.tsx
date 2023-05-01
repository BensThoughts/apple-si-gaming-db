import { NavLink } from '@remix-run/react';
import ThemeToggle from '../ThemeToggle';
import MenuDrawer from './MenuDrawer';
import { loggedInMenuLinks } from '../links/profileMenuLinks';
import { useLogout } from '~/lib/hooks/useLogout';

export default function ProfileMenuDrawer({
  isLoggedIn,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
}: {
  isLoggedIn: boolean;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const logout = useLogout();
  return (
    <MenuDrawer isOpen={isProfileMenuOpen} setIsOpen={setIsProfileMenuOpen} title="Account Menu">
      <div className="flex flex-col items-center w-full gap-6">
        <div className="flex flex-col justify-end content-between items-center pt-0 mt-7 w-full">
          {isLoggedIn ? (
          <>
            {loggedInMenuLinks.map((menuItem, idx) => (
              <NavLink
                key={`${menuItem.to}-${idx}`}
                to={menuItem.to}
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center justify-center w-full h-10 text-xl text-center
                           hover:bg-primary focus:outline-none focus-visible:show-ring-app-bg
                           rounded-sm"
              >
                {menuItem.text}
              </NavLink>
            ))}
            <button
              onClick={() => {
                logout();
                setIsProfileMenuOpen(false);
              }}
              className="flex items-center justify-center w-full h-10 text-xl text-center
                         hover:bg-primary focus:outline-none focus-visible:show-ring-app-bg
                         rounded-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink
            onClick={() => setIsProfileMenuOpen(false)}
            to="/profile"
            className="flex items-center justify-center w-full h-10 text-xl text-center
                       hover:bg-primary focus:outline-none focus-visible:show-ring-app-bg
                       rounded-sm"
          >
            Login
          </NavLink>
        )}
        </div>
      </div>
    </MenuDrawer>
  );
}
