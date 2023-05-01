import FeatherIcon from '../FeatherIcon';
import type { FeatherIconProps } from '../FeatherIcon';

export function AwardIcon({
  size = 24,
  ...rest
}: FeatherIconProps) {
  return (
    <FeatherIcon
      size={size}
      {...rest}
    >
      <circle cx="12" cy="8" r="7"></circle>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </FeatherIcon>
  );
}
