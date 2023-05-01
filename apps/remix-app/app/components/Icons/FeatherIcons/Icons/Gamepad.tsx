import FeatherIcon from '../FeatherIcon';
import type { FeatherIconProps } from '../FeatherIcon';

export function GamepadIcon({
  size,
  ...rest
}: FeatherIconProps) {
  return (
    <FeatherIcon
      size={size}
      {...rest}
    >
      <path d="M21 6H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
      <path d="M7 14v-4" />
      <path d="M5 12h4" />
      <path d="M16 13h.01" strokeWidth={2} />
      <path d="M19 11h.01" strokeWidth={2} />
    </FeatherIcon>
  );
};
