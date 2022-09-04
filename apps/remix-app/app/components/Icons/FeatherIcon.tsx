import { forwardRef } from 'react';

type IconProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

const FeatherIcon = forwardRef<SVGSVGElement, IconProps>(({
  size = 24,
  stroke,
  fill = 'currentColor',
  viewBox = '0 0 24 24',
  children,
  ...rest
}: IconProps, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={fill}
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      {...rest}
    >
      {children}
    </svg>
  );
});

FeatherIcon.displayName = 'FeatherIcon';

export default FeatherIcon;
