import SimpleIcon from '../SimpleIcon';
import type { SimpleIconProps } from '../SimpleIcon';

export function WindowsIcon({
  size = 24,
  ...rest
}: SimpleIconProps) {
  return (
    <SimpleIcon
      size={size}
      {...rest}
    >
      <title>Windows 11</title>
      <path d="M0,0H11.377V11.372H0ZM12.623,0H24V11.372H12.623ZM0,12.623H11.377V24H0Zm12.623,0H24V24H12.623"/>
    </SimpleIcon>
  );
};
