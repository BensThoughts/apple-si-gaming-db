import { forwardRef } from 'react';

type IconProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

const SimpleIcon = forwardRef<SVGSVGElement, IconProps>(({
  size,
  width = 24,
  height = 24,
  stroke = 'none',
  strokeWidth = 0,
  fill = 'currentColor',
  viewBox = '0 0 24 24',
  children,
  ...rest
}: IconProps, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ? size : width}
      height={size ? size : height}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      viewBox={viewBox}
      strokeLinecap="round"
      strokeLinejoin="round"
      ref={ref}
      {...rest}
    >
      {children}
    </svg>
  );
});

SimpleIcon.displayName = 'SimpleIcon';

export default SimpleIcon;
