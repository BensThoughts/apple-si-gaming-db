import React from 'react';

export default function PerformancePostFormWrapper({
  children,
}: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col gap-3 items-center justify-center bg-tertiary
                 p-6 rounded-lg w-full"
    >
      {children}
    </div>
  );
}
