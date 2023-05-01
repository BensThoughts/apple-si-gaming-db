import { BaseSvgIcon } from '../BaseSvgIcon';
import type { BaseSvgIconProps } from '../BaseSvgIcon';

export default function SimpleIcon({
  size,
  width = 24,
  height = 24,
  stroke = 'none',
  strokeWidth = 0,
  fill = 'currentColor',
  viewBox = '0 0 24 24',
  children,
  ...rest
}: BaseSvgIconProps) {
  return (
    <BaseSvgIcon
      xmlns="http://www.w3.org/2000/svg"
      width={size ? size : width}
      height={size ? size : height}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      viewBox={viewBox}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </BaseSvgIcon>
  );
};

