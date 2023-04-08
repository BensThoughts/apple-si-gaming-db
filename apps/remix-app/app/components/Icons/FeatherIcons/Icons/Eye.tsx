import FeatherIcon from '../FeatherIcon';

type IconProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

export function EyeIcon({
  size,
  ...rest
}: IconProps) {
  return (
    <FeatherIcon
      size={size}
      {...rest}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </FeatherIcon>
  );
};
