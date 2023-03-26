import { forwardRef } from 'react';

export type FlatIcon60Props = {
  size?: number,
} & React.SVGAttributes<SVGElement>

const FlatIcon60 = forwardRef<SVGSVGElement, FlatIcon60Props>(({
  size = 24,
  width,
  height,
  fill = 'currentColor',
  strokeWidth = 1,
  viewBox = '0 0 60 60',
  children,
  ...rest
}: FlatIcon60Props, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ? size : width}
      height={size ? size : height}
      fill={fill}
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

FlatIcon60.displayName = 'FlatIcon60';

export default FlatIcon60;
