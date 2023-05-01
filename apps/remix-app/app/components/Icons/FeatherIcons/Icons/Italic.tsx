import FeatherIcon from '../FeatherIcon';
import type { FeatherIconProps } from '../FeatherIcon';

export function ItalicIcon({
  size = 24,
  ...rest
}: FeatherIconProps) {
  return (
    <FeatherIcon
      size={size}
      {...rest}
    >
      <line x1="19" y1="4" x2="10" y2="4"></line>
      <line x1="14" y1="20" x2="5" y2="20"></line>
      <line x1="15" y1="4" x2="9" y2="20"></line>
    </FeatherIcon>
  );
}
