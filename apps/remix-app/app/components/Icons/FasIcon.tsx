import { forwardRef } from 'react';

type IconProps = {
  size?: number,
  gradient?: boolean,
} & React.SVGAttributes<SVGElement>

const FasIcon = forwardRef<SVGSVGElement, IconProps>(({
  size = 24,
  fill = 'currentColor',
  viewBox = '0 0 512 512',
  children,
  ...rest
}: IconProps, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={fill}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      {...rest}
    >
      {children}
    </svg>
  );
});

FasIcon.displayName = 'FasIcon';

export default FasIcon;
