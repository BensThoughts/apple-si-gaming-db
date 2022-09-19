import React from 'react';
import { InformationCircleIcon } from '~/components/Icons';

export default function AsideInfoCard({
  title,
  iconBackground,
  className,
  children,
  ...rest
}: {
  title: string;
  iconBackground: 'primary' | 'secondary',
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const iconBg = iconBackground === 'primary' ? 'bg-app-bg' : 'bg-app-bg-secondary';
  return (
    <aside className={`relative px-6 py-8 border-l-[4px] border-solid border-secondary
                       rounded-lg mt-2 bg-primary text-primary-faded ${className}`} {...rest}>
      <div className={`rounded-[50%] absolute inset-0 w-[40px] h-[40px]
                       -translate-x-[50%] -translate-y-[50%] ${iconBg}`}>
        <InformationCircleIcon className="absolute inset-0 translate-x-[3px] translate-y-[3px] text-icon-secondary w-8 h-8" />
      </div>
      <strong className="font-bold">{title}</strong>
      <div>{children}</div>
    </aside>
  );
}
