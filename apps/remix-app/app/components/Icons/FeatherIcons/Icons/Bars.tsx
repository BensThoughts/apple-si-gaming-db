import FeatherIcon from '../FeatherIcon';

type IconProps = {
  size?: number,
  color?: string,
} & React.SVGAttributes<SVGElement>

export function BarsIcon({
  size = 24,
  ...rest
}: IconProps) {
  return (
    <FeatherIcon
      size={size}
      {...rest}
    >
      <path d="M3 12h18M3 5h18M3 19h18" />
    </FeatherIcon>
  );
}
