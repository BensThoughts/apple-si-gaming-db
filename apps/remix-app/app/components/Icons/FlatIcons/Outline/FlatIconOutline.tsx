import { forwardRef } from 'react';

export type FlatIconOutlineProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

const FlatIconOutline = forwardRef<SVGSVGElement, FlatIconOutlineProps>(({
  size = 24,
  width,
  height,
  viewBox = '0 0 60 60',
  children,
  ...rest
}: FlatIconOutlineProps, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ? size : width}
      height={size ? size : height}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      {...rest}
    >
      {children}
    </svg>
  );
});

FlatIconOutline.displayName = 'FlatIconOutline';

export default FlatIconOutline;
