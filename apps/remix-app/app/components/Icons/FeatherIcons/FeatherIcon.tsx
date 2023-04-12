/*
  This component is also used to HeroIcons
*/

import { forwardRef } from 'react';

export type FeatherIconProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

const FeatherIcon = forwardRef<SVGSVGElement, FeatherIconProps>(({
  viewBox = '0 0 24 24',
  size = 24,
  width,
  height,
  stroke = 'currentColor',
  strokeWidth = 2,
  fill = 'none',
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  preserveAspectRatio = 'xMidYMid meet',
  children,
  ...rest
}: FeatherIconProps, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width ? width : size}
      height={height ? height : size}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      preserveAspectRatio={preserveAspectRatio}
      ref={ref}
      {...rest}
    >
      {children}
    </svg>
  );
});

FeatherIcon.displayName = 'FeatherIcon';

export default FeatherIcon;
