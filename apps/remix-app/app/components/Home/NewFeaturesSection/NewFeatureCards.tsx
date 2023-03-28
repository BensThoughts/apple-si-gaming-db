import { Fragment } from 'react';
import type { FlatIconOutlineProps } from '~/components/Icons/FlatIcons/Outline/FlatIconOutline';
import { NavLink } from '@remix-run/react';

export default function NewFeatureCards({
  features,
}: {
  features: {
    title: string;
    content: string;
    to: string;
    Icon: React.ComponentType<FlatIconOutlineProps>;
  }[]
}) {
  return (
    <div className="flex justify-center w-full max-w-lg lg:max-w-full flex-wrap gap-4">
      {features.map(({ title, to, content, Icon }, idx) => (
        <Fragment key={`new_feature_${idx}`}>
          <NewFeatureCard title={title} to={to} Icon={Icon}>
            {content}
          </NewFeatureCard>
        </Fragment>
      ))}
    </div>
  );
}

function NewFeatureCard({
  title,
  to,
  Icon,
  children,
}: {
  title: string;
  to: string;
  Icon: React.ComponentType<FlatIconOutlineProps>;
  children: string;
}) {
  return (
    <NavLink
      to={to}
      className="flex flex-col gap-4 h-[280px] sm:h-[240px] w-[160px] sm:w-[200px]
                 bg-tertiary shadow-md shadow-black p-5 rounded-xl ease-out duration-400
                 lg:hover:translate-y-[-20px] group relative inset-0
                 focus-visible:show-ring"
    >
      <h3
        className="z-30 font-semibold text-2xl relative text-primary
                     group-hover:text-primary-highlight"
      >
        {title}
      </h3>
      <p
        className="relative z-30 text-primary-faded group-hover:text-primary text-sm">
        {children}
      </p>

      <div
        className="px-3 absolute bottom-[20px] left-0 z-[25] w-full flex items-center"
      >
        <Icon
          className="h-11 w-11 fill-gray stroke-gray stroke-1 -rotate-12 mr-2 opacity-100
                       group-hover:opacity-0 ease-linear duration-400"
        />
        <div className="w-full h-[5px] bg-gray rounded-full" />
      </div>

      <div
        className="px-3 absolute bottom-[20px] left-0 z-[25] w-full flex items-center"
      >
        <Icon
          className="h-11 w-11 fill-secondary-highlight stroke-secondary-highlight stroke-1
                     opacity-0 group-hover:opacity-100 -rotate-12 ease-out
                     duration-400 mr-2"

        />
        <div
          className="w-0 h-[5px] bg-gradient-to-r from-secondary to-secondary-highlight
                      group-hover:w-full ease-out duration-400 rounded-full"
        />
      </div>

    </NavLink>
  );
}
