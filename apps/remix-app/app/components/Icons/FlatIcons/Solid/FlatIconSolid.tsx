import { BaseSvgIcon } from '../../BaseSvgIcon';
import type { BaseSvgIconProps } from '../../BaseSvgIcon';

export type FlatIconSolidProps = BaseSvgIconProps;

export default function FlatIconSolid({
  size = 24,
  width,
  height,
  viewBox = '0 0 60 60',
  children,
  ...rest
}: FlatIconSolidProps) {
  return (
    <BaseSvgIcon
      xmlns="http://www.w3.org/2000/svg"
      width={size ? size : width}
      height={size ? size : height}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      {...rest}
    >
      {children}
    </BaseSvgIcon>
  );
};
