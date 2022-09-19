import React from 'react';
import { InformationCircleIcon } from '~/components/Icons';

export default function AsideInfoCard({
  title,
  className,
  children,
  ...rest
}: {
  title: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <aside className={`relative px-6 py-8 border-l-[4px] border-solid border-secondary
                       rounded-lg mt-2 bg-primary ${className}`} {...rest}>
      <div className="rounded-[50%] absolute inset-0 bg-app-bg w-[40px] h-[40px] -translate-x-[50%] -translate-y-[50%]">
        <InformationCircleIcon className="absolute inset-0 translate-x-[3px] translate-y-[3px] text-icon-secondary w-8 h-8" />
      </div>
      <strong className="font-bold">{title}</strong>
      <div>{children}</div>
    </aside>
  );
}
