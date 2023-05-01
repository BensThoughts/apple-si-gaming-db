import FeatherIcon from '../FeatherIcon';
import type { FeatherIconProps } from '../FeatherIcon';

export function ChevronUpIcon({
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </FeatherIcon>
  );
}
