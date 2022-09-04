import React from 'react';

export default function AnimatedUnderline({
  children,
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`relative px-0 py-[0.1em] overflow-hidden no-underline
                      after:block after:absolute after:bottom-[-3px] after:left-0
                      after:w-0 after:h-[0.2em] after:bg-secondary after:transition-transform
                      after:hover:w-full`}>
      {children}
    </span>
  );
}
