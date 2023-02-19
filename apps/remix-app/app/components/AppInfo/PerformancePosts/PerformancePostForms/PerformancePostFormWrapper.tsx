import React from 'react';

export default function PerformancePostFormWrapper({
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex flex-col gap-3 items-center justify-center bg-tertiary
                  border-solid border-1 border-secondary p-3 rounded-lg w-full
                  `}
    >
      {children}
    </div>
  );
}
