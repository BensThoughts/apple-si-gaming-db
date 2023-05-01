import { BaseSvgIcon } from '../BaseSvgIcon';
import type { BaseSvgIconProps } from '../BaseSvgIcon';

export type FeatherIconProps = BaseSvgIconProps;

export default function FeatherIcon({
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
}: FeatherIconProps) {
  return (
    <BaseSvgIcon
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
      {...rest}
    >
      {children}
    </BaseSvgIcon>
  );
};
