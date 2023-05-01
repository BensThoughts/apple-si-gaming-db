import { BaseSvgIcon } from '../../BaseSvgIcon';
import type { BaseSvgIconProps } from '../../BaseSvgIcon';

export type FlatIconBlueLinealProps = BaseSvgIconProps;

export default function FlatIconBlueLineal({
  size = 24,
  width,
  height,
  // fill = 'currentColor',
  stroke = 'currentColor',
  strokeWidth = 1,
  viewBox = '0 0 60 60',
  children,
  ...rest
}: FlatIconBlueLinealProps) {
  return (
    <BaseSvgIcon
      xmlns="http://www.w3.org/2000/svg"
      width={size ? size : width}
      height={size ? size : height}
      // fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      {...rest}
    >
      {children}
    </BaseSvgIcon>
  );
};
