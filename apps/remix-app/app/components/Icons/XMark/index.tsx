import FeatherIcon from '../FeatherIcon';

type IconProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

export default function XMarkIcon({
  size,
  ...rest
}: IconProps) {
  return (
    <FeatherIcon
      size={size}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </FeatherIcon>
  );
};
