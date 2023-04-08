import FeatherIcon from '../FeatherIcon';

type IconProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

export function CheckIcon({
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </FeatherIcon>
  );
}
