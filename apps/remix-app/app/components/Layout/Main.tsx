import React from 'react';

export default function Main({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <main className={`px-4 md:px-10 ${className}`}>
      {children}
    </main>
  );
}
