import React from 'react';
import { classNames } from '~/lib/css/classNames';

export default function AnimatedUnderline({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={classNames(
          'relative px-0 py-[0.1em] overflow-hidden no-underline',
          'after:block after:absolute after:bottom-[-3px] after:left-0 after:w-0 ',
          'after:h-[0.2em] after:bg-secondary after:transition-all hover:after:w-full',
          'after:rounded-full text-primary-highlight after:duration-200',
          className ? className : '',
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
