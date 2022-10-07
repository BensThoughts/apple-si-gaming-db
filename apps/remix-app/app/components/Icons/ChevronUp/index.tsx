import FeatherIcon from '../FeatherIcon';

type IconProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

export default function AppleIcon({
  size,
  strokeWidth = 1.5,
  ...rest
}: IconProps) {
  return (
    <FeatherIcon
      size={size}
      strokeWidth={strokeWidth}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </FeatherIcon>
  );
}
