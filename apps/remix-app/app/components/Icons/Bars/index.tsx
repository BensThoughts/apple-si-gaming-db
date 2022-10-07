import FeatherIcon from '../FeatherIcon';

type IconProps = {
  size?: number,
  color?: string,
} & React.SVGAttributes<SVGElement>

export default function Bars({
  size = 24,
  ...rest
}: IconProps) {
  return (
    <FeatherIcon
      size={size}
      {...rest}
    >
      <path d="M3 12h18M3 6h18M3 18h18" />
    </FeatherIcon>
  );
}
