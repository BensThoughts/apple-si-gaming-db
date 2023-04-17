import { NavLink } from '@remix-run/react';
import ThemeToggle from './ThemeToggle';
import MenuDrawer from '../MenuDrawer';
import { navMenuLinks } from './navMenuLinks';

export default function MainMenuDrawer({
  isLoggedIn,
  isMainMenuOpen,
  setIsMainMenuOpen,
}: {
  isLoggedIn: boolean;
  isMainMenuOpen: boolean;
  setIsMainMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
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
  );
}