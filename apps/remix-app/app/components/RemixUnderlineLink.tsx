import { Link } from '@remix-run/react';
import React from 'react';
import { classNames } from '~/lib/css/classNames';

type RemixUnderlineLinkProps = {
  to: string;
} & React.HTMLAttributes<HTMLSpanElement>

export default function RemixUnderlineLink({
  to,
  className,
  children,
  ...rest
}: RemixUnderlineLinkProps) {
  return (
    <Link
      to={to}
      className={classNames(
          'inline relative px-0 py-[0.1em] overflow-hidden no-underline',
          'after:block after:absolute after:bottom-[-3px] after:left-0',
          'after:h-[0.2em] after:bg-secondary after:transition-transform',
          'after:w-full after:rounded-full text-secondary focus:outline-none',
          'focus-visible:show-ring-tertiary rounded-sm',
          className ? className : '',
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
