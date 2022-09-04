import React from 'react';

export default function IconButton({
  // TODO: Why?
  // eslint-disable-next-line react/prop-types
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`inline-flex items-center px-4 py-2 font-bold rounded bg-secondary ${className ? className : ''}`} {...rest}>
      {children}
    </button>
  );
}
