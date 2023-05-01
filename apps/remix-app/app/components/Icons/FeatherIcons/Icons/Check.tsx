import FeatherIcon from '../FeatherIcon';
import type { FeatherIconProps } from '../FeatherIcon';

export function CheckIcon({
  size,
  strokeWidth = 1.5,
  ...rest
}: FeatherIconProps) {
  return (
    <FeatherIcon
      size={size}
      strokeWidth={strokeWidth}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </FeatherIcon>
  );
}
