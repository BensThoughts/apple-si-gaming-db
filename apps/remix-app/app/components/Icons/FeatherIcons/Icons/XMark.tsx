import FeatherIcon from '../FeatherIcon';
import type { FeatherIconProps } from '../FeatherIcon';

export function XMarkIcon({
  size,
  ...rest
}: FeatherIconProps) {
  return (
    <FeatherIcon
      size={size}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </FeatherIcon>
  );
};
