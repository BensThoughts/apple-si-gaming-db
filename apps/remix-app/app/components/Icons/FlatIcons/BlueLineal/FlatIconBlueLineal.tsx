import { forwardRef } from 'react';

export type FlatIconBlueLinealProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

const FlatIconBlueLineal = forwardRef<SVGSVGElement, FlatIconBlueLinealProps>(({
  size = 24,
  width,
  height,
  // fill = 'currentColor',
  stroke = 'currentColor',
  strokeWidth = 1,
  viewBox = '0 0 60 60',
  children,
  ...rest
}: FlatIconBlueLinealProps, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ? size : width}
      height={size ? size : height}
      // fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      {...rest}
    >
      {children}
    </svg>
  );
});

FlatIconBlueLineal.displayName = 'FlatIconBlueLineal';

export default FlatIconBlueLineal;
