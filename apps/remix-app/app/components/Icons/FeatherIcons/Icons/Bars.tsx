import FeatherIcon from '../FeatherIcon';
import type { FeatherIconProps } from '../FeatherIcon';

export function BarsIcon({
  size = 24,
  ...rest
}: FeatherIconProps) {
  return (
    <FeatherIcon
      size={size}
      {...rest}
    >
      <path d="M3 12h18M3 5h18M3 19h18" />
    </FeatherIcon>
  );
}
