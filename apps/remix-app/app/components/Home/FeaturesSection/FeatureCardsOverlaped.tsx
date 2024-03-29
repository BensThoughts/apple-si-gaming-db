import { Fragment } from 'react';
import type { BaseSvgIconProps } from '~/components/Icons/BaseSvgIcon';

export default function FeatureCardsOverlapped({
  features,
}: {
  features: {
    title: string;
    content: string;
    Icon: React.ComponentType<BaseSvgIconProps>;
  }[]
}) {
  return (
    <div className="flex justify-center w-full ml-[35px]">
      {features.map(({ title, content, Icon }, idx) => (
        <Fragment key={`new_feature_${idx}`}>
          <FeatureCard title={title} Icon={Icon}>{content}</FeatureCard>
        </Fragment>
      ))}
    </div>
  );
}

function FeatureCard({
  title,
  Icon,
  children,
}: {
  title: string;
  Icon: React.ComponentType<BaseSvgIconProps>;
  children: string;
}) {
  return (
    <div
      className="h-[240px] w-[241px] relative left-0 ease-out duration-400
                 first:-ml-[0px] -ml-[50px] hover:translate-y-[-20px] peer
                 peer-hover:relative peer-hover:left-[40px] z-20 group"
    >
      <div className="flex flex-col gap-4 h-[240px] w-[200px] bg-tertiary shadow-md
                      shadow-black z-30 p-5 rounded-xl relative">
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
            className="h-9 w-9 fill-gray -rotate-12 mr-2 opacity-100
                       group-hover:opacity-0 ease-linear duration-400"
          />
          <div className="w-full h-[5px] bg-gray rounded-full" />
        </div>

        <div
          className="px-3 absolute bottom-[20px] left-0 z-[25] w-full flex items-center"
        >
          <Icon
            className="h-9 w-9 fill-secondary-highlight opacity-0
                       group-hover:opacity-100 -rotate-12 ease-out
                       duration-400 mr-2"

          />
          <div
            className="w-0 h-[5px] bg-gradient-to-r from-secondary to-secondary-highlight
                      group-hover:w-full ease-out duration-400 rounded-full"
          />
        </div>

      </div>
    </div>
  );
}
