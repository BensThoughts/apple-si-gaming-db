import FeatherIcon from '../FeatherIcon';

type IconProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

export default function AppleIcon({
  size = 32,
  ...rest
}: IconProps) {
  return (
    <FeatherIcon
      size={size}
      {...rest}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </FeatherIcon>
  );
};
