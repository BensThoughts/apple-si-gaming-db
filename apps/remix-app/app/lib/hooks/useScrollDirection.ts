import { useState, useEffect } from 'react';
import { useWindowScroll } from 'react-use';

export type ScrollDirection = 'up' | 'down';

// type ScrollDirectionChange = {
//   prevScrollDirection: ScrollDirection;
//   yCoordinateOnDirectionChange: number;
// }

export default function useScrollDirection() {
  const [lastScrollYCoordinate, setLastScrollYCoordinate] = useState(0);
  const [initialScrollDirection, setInitialScrollDirection] = useState<ScrollDirection | undefined>(undefined);
  const [initialScrollYCoordinate, setInitialScrollYCoordinate] = useState<number | undefined>(undefined);
  const { y } = useWindowScroll();
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection | undefined>(undefined);

  const [yCoordinateOnDirectionChange, setYCoordinateOnDirectionChange] = useState<number | undefined>(undefined);
  const [prevScrollDirection, setPrevScrollDirection] = useState<ScrollDirection | undefined>(undefined);

  const [mounted, setMounted] = useState(false);
  // const [scrollDirectionChange, setScrollDirectionChange] = useState<ScrollDirectionChange | undefined>(undefined);

  useEffect(() => {
    if (!mounted) {
      setLastScrollYCoordinate(y);
      setMounted(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const listener = (e: any) => {
    const scrollDirection = y > lastScrollYCoordinate ? 'down' : 'up';
    if (initialScrollDirection === undefined) {
      setInitialScrollDirection(scrollDirection);
      setInitialScrollYCoordinate(y);
      return;
    }
    if (
      scrollDirection === prevScrollDirection ||
      scrollDirection != initialScrollDirection
    ) {
      setYCoordinateOnDirectionChange(y);
      setPrevScrollDirection(scrollDirection === 'down' ? 'up' : 'down');
    }
    setScrollDirection(scrollDirection);
    setLastScrollYCoordinate(y);
  };

  useEffect(() => {
    window.addEventListener('scroll', listener);
    return () => {
      window.removeEventListener('scroll', listener);
    };
  });

  return {
    y,
    initialScrollDirection,
    initialScrollYCoordinate,
    scrollDirection,
    prevScrollDirection,
    yCoordinateOnDirectionChange,
  } as const;
}
