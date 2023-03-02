import type { MouseEventHandler, ReactNode } from 'react';
import { NavLink } from '@remix-run/react';
import AnimatedUnderline from '~/components/AnimatedUnderline';
// import Link from '~/components/Link';
// import AnimatedUnderline from '~/components/AnimatedUnderline';
// import AnimatedLink from '~/components/AnimatedLink';

type MenuItemsProps = {
  href: string,
  animatedLink?: boolean,
  className?: string,
  onClick?: MouseEventHandler<HTMLAnchorElement>
  children: ReactNode,
  key: string,
}

const MenuItem = ({
  href = '/',
  animatedLink = false,
  className = '',
  onClick,
  children,
  ...rest
}: MenuItemsProps) => {
  return (
    <NavLink to={href} className="focus-visible:show-ring px-1 rounded-sm">
      {animatedLink
        ? (
          <AnimatedUnderline className={className} onClick={onClick}>
            {children}
          </AnimatedUnderline>
        ) : (
          <span onClick={onClick} className={`text-primary ${className}`}>
            {children}
          </span>
        )
      }
    </NavLink>
  );
};

export default MenuItem;
