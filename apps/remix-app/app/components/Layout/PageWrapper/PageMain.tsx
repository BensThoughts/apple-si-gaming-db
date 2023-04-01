import React from 'react';

type MainProps = React.HTMLAttributes<HTMLDivElement>

export default function PageMain({
  children,
  className,
}: MainProps) {
  return (
    <main className={`px-4 md:px-10 mx-auto ${className ? className : ''}`}>
      {children}
    </main>
  );
}
