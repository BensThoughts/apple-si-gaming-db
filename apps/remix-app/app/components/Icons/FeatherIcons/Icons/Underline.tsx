import FeatherIcon from '../FeatherIcon';

type IconProps = {
  size?: number,
  color?: string,
} & React.SVGAttributes<SVGElement>

export function UnderlineIcon({
  size = 24,
  ...rest
}: IconProps) {
  return (
    <FeatherIcon
      size={size}
      {...rest}
    >
      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
      <line x1="4" y1="21" x2="20" y2="21"></line>
    </FeatherIcon>
  );
}
