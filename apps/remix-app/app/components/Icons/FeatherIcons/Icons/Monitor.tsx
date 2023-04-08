import FeatherIcon from '../FeatherIcon';

type IconProps = {
  size?: number,
  color?: string,
} & React.SVGAttributes<SVGElement>

export function MonitorIcon({
  size = 24,
  ...rest
}: IconProps) {
  return (
    <FeatherIcon
      size={size}
      {...rest}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </FeatherIcon>
  );
}
