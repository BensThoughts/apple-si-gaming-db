import React from 'react';
import { InformationCircleIcon } from '~/components/Icons';

export default function AsideCard({
  title,
  iconBackground,
  children,
}: {
  title: string;
  children: React.ReactNode;
  iconBackground: 'bg-primary' | 'bg-secondary' | 'bg-tertiary' | 'bg-app-bg' | 'bg-app-bg-secondary',
}) {
  return (
    <div className="p-4">
      <aside className="relative px-6 py-8 border-l-[4px] border-solid border-secondary
                       rounded-lg mt-5 bg-primary text-primary w-full max-w-md">
        <div className={`rounded-[50%] absolute inset-0 w-[40px] h-[40px]
                       -translate-x-[50%] -translate-y-[50%] ${iconBackground}`}>
          <InformationCircleIcon
            className="absolute inset-0 translate-x-[3px] translate-y-[3px]
                       fill-transparent stroke-secondary stroke-2 w-8 h-8"
          />
        </div>
        <div className="flex flex-col gap-3">
          <strong className="font-bold">{title}</strong>
          <div>{children}</div>
        </div>
      </aside>
    </div>
  );
}
