import { forwardRef } from 'react';

export type FlatIconSolidProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

const FlatIconSolid = forwardRef<SVGSVGElement, FlatIconSolidProps>(({
  size = 24,
  width,
  height,
  viewBox = '0 0 60 60',
  children,
  ...rest
}: FlatIconSolidProps, ref) => {
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

FlatIconSolid.displayName = 'FlatIcon60Solid';

export default FlatIconSolid;
