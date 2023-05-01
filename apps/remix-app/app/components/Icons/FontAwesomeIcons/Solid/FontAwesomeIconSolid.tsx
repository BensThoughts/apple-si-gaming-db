import { BaseSvgIcon } from '../../BaseSvgIcon';
import type { BaseSvgIconProps } from '../../BaseSvgIcon';

export type FontAwesomeSolidIconProps = BaseSvgIconProps;

export default function FontAwesomeIconSolid({
  size = 24,
  width,
  height,
  fill = 'currentColor',
  strokeWidth = 0,
  viewBox = '0 0 512 512',
  children,
  ...rest
}: FontAwesomeSolidIconProps) {
  return (
    <BaseSvgIcon
      xmlns="http://www.w3.org/2000/svg"
      width={size ? size : width}
      height={size ? size : height}
      fill={fill}
      strokeWidth={strokeWidth}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      {...rest}
    >
      {children}
    </BaseSvgIcon>
  );
};

