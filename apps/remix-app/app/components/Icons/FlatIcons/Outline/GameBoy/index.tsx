import FlatIcon60 from '../../FlatIcon60';

type IconProps = {
  size?: number,
} & React.SVGAttributes<SVGElement>

export function GameBoyOutlineIcon({
  size = 24,
  ...rest
}: IconProps) {
  return (
    <FlatIcon60
      size={size}
      viewBox="'0 0 576 512'"
      {...rest}
    >
      <path
        d="m202.817 216.436c-2.559 0-5.118-.976-7.071-2.929-3.905-3.905-3.905-10.237 0-14.143l55.605-55.605c3.905-3.905 10.236-3.906 14.143 0 3.905 3.905 3.905 10.237 0 14.142l-55.605 55.606c-1.953 1.952-4.513 2.929-7.072 2.929z" />
      <path
        d="m189.096 168.051c-2.559 0-5.119-.976-7.071-2.929-3.905-3.905-3.905-10.237 0-14.143l38.274-38.274c3.905-3.905 10.237-3.905 14.143 0 3.905 3.905 3.905 10.237 0 14.143l-38.274 38.274c-1.953 1.953-4.513 2.929-7.072 2.929z" />
      <path
        d="m292.138 467.425h-72.276c-5.523 0-10-4.477-10-10s4.477-10 10-10h72.276c5.523 0 10 4.477 10 10s-4.477 10-10 10z" />
      <path
        d="m354.991 363.687c-8.229 0-16.459-3.132-22.725-9.397-12.53-12.53-12.53-32.919 0-45.449s32.919-12.53 45.449 0 12.53 32.919 0 45.449c-6.265 6.265-14.495 9.397-22.724 9.397zm0-44.253c-3.108 0-6.216 1.183-8.582 3.549-4.732 4.732-4.732 12.432 0 17.164 4.731 4.732 12.433 4.732 17.164 0 4.732-4.732 4.732-12.432 0-17.164-2.366-2.366-5.474-3.549-8.582-3.549z" />
      <path
        d="m294.948 423.73c-8.229 0-16.459-3.132-22.725-9.397-12.53-12.53-12.53-32.919 0-45.449s32.919-12.53 45.449 0 12.53 32.919 0 45.449c-6.265 6.265-14.495 9.397-22.724 9.397zm0-44.253c-3.108 0-6.216 1.183-8.582 3.549-4.732 4.732-4.732 12.432 0 17.164 4.731 4.732 12.433 4.732 17.164 0 4.732-4.732 4.732-12.432 0-17.164-2.366-2.366-5.474-3.549-8.582-3.549z" />
      <path
        d="m198.393 416.03h-38.154c-5.523 0-10-4.477-10-10v-15.366h-15.366c-5.523 0-10-4.477-10-10v-38.154c0-5.523 4.477-10 10-10h15.366v-15.366c0-5.523 4.477-10 10-10h38.154c5.523 0 10 4.477 10 10v15.366h15.366c5.523 0 10 4.477 10 10v38.154c0 5.523-4.477 10-10 10h-15.366v15.366c0 5.523-4.477 10-10 10zm-28.154-20h18.154v-15.366c0-5.523 4.477-10 10-10h15.366v-18.154h-15.366c-5.523 0-10-4.477-10-10v-15.366h-18.154v15.366c0 5.523-4.477 10-10 10h-15.366v18.154h15.366c5.523 0 10 4.477 10 10z" />
      <path
        d="m377.13 173.29c-4.177 0-8.006-2.708-9.415-6.636-1.389-3.873-.195-8.327 2.947-10.986 3.284-2.779 8.09-3.123 11.745-.864 3.494 2.159 5.334 6.41 4.523 10.436-.93 4.615-5.083 8.05-9.8 8.05z" />
      <path
        d="m377.127 266h-242.254c-5.523 0-10-4.477-10-10v-185.787c0-5.523 4.477-10 10-10h242.255c5.523 0 10 4.477 10 10v47.687c0 5.523-4.477 10-10 10s-10-4.477-10-10v-37.687h-222.255v165.787h222.255v-37.687c0-5.523 4.477-10 10-10s10 4.477 10 10v47.687c-.001 5.523-4.478 10-10.001 10z" />
      <path
        d="m315.473 512h-194.797c-26.88 0-48.75-21.869-48.75-48.75v-414.5c0-26.88 21.869-48.75 48.75-48.75h270.647c26.88 0 48.75 21.869 48.75 48.75v338.65c0 68.704-55.895 124.6-124.6 124.6zm-194.797-492c-15.853 0-28.75 12.897-28.75 28.75v414.5c0 15.853 12.897 28.75 28.75 28.75h194.796c57.677 0 104.601-46.924 104.601-104.601v-338.649c0-15.853-12.897-28.75-28.75-28.75z" />
    </FlatIcon60>
  );
};