import { Fragment } from 'react';
import { Transition } from '@headlessui/react';

import useScrollDirection from '~/lib/hooks/useScrollDirection';

type NavHiderProps = {
  className?: string;
  children: React.ReactNode;
}

export default function NavHider({ className, children }: NavHiderProps) {
  const {
    y,
    scrollDirection,
    // initialScrollDirection,
    // initialScrollYCoordinate,
    // prevScrollDirection,
    yCoordinateOnDirectionChange,
  } = useScrollDirection();

  // console.log('START');
  // console.log('y: ' + y);
  // console.log('scrollDirection: ' + scrollDirection);
  // console.log('initialScrollDirection: ' + initialScrollDirection);
  // console.log('initialScrollYCoordinate: ' + initialScrollYCoordinate);

  // console.log('yCoordinateOnDirectionChange: ' + yCoordinateOnDirectionChange);
  // console.log('prevScrollDirection: ' + prevScrollDirection);

  const alwaysShowUntil = 350;
  const showOnUpAfter = 350;
  // const hideOnDownAfter = 0;


  const shouldShowNav = () => {
    if (scrollDirection === undefined) {
      return true;
    }
    if (y >= 0 && y <= alwaysShowUntil) {
      return true;
    }
    if (scrollDirection === 'down' && y > alwaysShowUntil) {
      return false;
    }
    if (
      yCoordinateOnDirectionChange != undefined &&
      scrollDirection === 'up' &&
      y > yCoordinateOnDirectionChange - showOnUpAfter) {
      return false;
    }

    return true;
  };

  const showNav = shouldShowNav();

  return (
    <Transition
      as={Fragment}
      show={showNav}
      enter="transform transition duration-200 ease-out"
      enterFrom="-translate-y-full"
      enterTo="translate-y-0"
      leave="transform transition duration-200 ease-in"
      leaveFrom="translate-y-0"
      leaveTo="-translate-y-full"
    >
      <nav className={`fixed inset-0 h-14 max-h-14 z-[49] ${className ? className : ''}`}>
        {children}
      </nav>
    </Transition>


  );
}
