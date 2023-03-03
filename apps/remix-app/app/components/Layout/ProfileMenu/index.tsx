import { Menu, Transition } from '@headlessui/react';
import {
  NavLink,
  useFetcher,
} from '@remix-run/react';
import { Fragment } from 'react';
import { SteamIcon } from '~/components/Icons';
import { loggedInMenuLinks } from './profileMenuLinks';

export default function ProfileMenu({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const fetcher = useFetcher();
  return (
    <div className="flex items-center text-right">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="group flex items-center justify-center gap-2 w-full h-[38px] rounded-md bg-primary py-px px-2 text-base font-medium text-primary hover:bg-primary-highlight focus:outline-none focus-visible:show-ring">
          Account
          <SteamIcon
            className="text-icon-secondary rounded-md w-full h-full group-hover:text-icon-secondary-highlight"
            aria-hidden="true"
          />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-secondary rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              {isLoggedIn ? (
                <>
                  {loggedInMenuLinks.map((link) => (
                    <Menu.Item key={link.to}>
                      {({ active }) => (
                        <NavLink
                          to={link.to}
                          className={`${
                            active ? 'bg-primary-highlight text-primary-highlight' : 'text-primary'
                          } flex w-full items-center rounded-md px-2 py-2 text-base hover:bg-primary-highlight hover:text-primary-highlight`}
                        >
                          {link.title}
                        </NavLink>
                      )}
                    </Menu.Item>
                  ))}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => fetcher.submit({}, { action: '/actions/logout', method: 'post' })}
                        // href="/api/auth/steam/logout"
                        className={`${
                          active ? 'bg-primary-highlight text-primary-highlight' : 'text-primary'
                        } flex w-full items-center rounded-md px-2 py-2 text-base hover:bg-primary-highlight hover:text-primary-highlight`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </>
              ) : (
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/api/auth/steam/login"
                      className={`${
                        active ? 'bg-primary-highlight text-primary-highlight' : 'text-primary'
                      } flex w-full items-center justify-between rounded-md px-2 py-2 text-base hover:bg-primary-highlight hover:text-primary-highlight`}
                    >
                      <span>
                        Login
                      </span>
                      <img
                        src="/steam_sign_in.png"
                        alt="sign in with steam"
                        width={85.5}
                        height={32.25}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
                        }}
                      />
                    </a>
                  )}
                </Menu.Item>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
