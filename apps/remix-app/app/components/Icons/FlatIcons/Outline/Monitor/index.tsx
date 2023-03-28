import FlatIconOutline from '../FlatIconOutline';
import type { FlatIconOutlineProps } from '../FlatIconOutline';


export function MonitorOutlineIcon({
  size = 24,
  ...rest
}: FlatIconOutlineProps) {
  return (
    <FlatIconOutline
      size={size}
      viewBox="0 0 60 60"
      {...rest}
    >
      <path d="M57,0H3A3.1,3.1,0,0,0,0,3.182V46.818A3.1,3.1,0,0,0,3,50H20.382l-2,4H15a3,3,0,0,0,0,6H45a3,3,0,0,0,0-6H41.618l-2-4H57a3.1,3.1,0,0,0,3-3.182V3.182A3.1,3.1,0,0,0,57,0ZM3,2H57a1.117,1.117,0,0,1,1,1.182V42H2V3.182A1.117,1.117,0,0,1,3,2ZM46,57a1,1,0,0,1-1,1H15a1,1,0,0,1,0-2H45A1,1,0,0,1,46,57Zm-6.618-3H20.618l2-4H37.382ZM57,48H3a1.117,1.117,0,0,1-1-1.182V44H58v2.818A1.117,1.117,0,0,1,57,48Z" />
      <path d="M5,8a1,1,0,0,0,.707-.293l2-2A1,1,0,0,0,6.293,4.293l-2,2A1,1,0,0,0,5,8Z" />
      <path d="M5,13a1,1,0,0,0,.707-.293l7-7a1,1,0,1,0-1.414-1.414l-7,7A1,1,0,0,0,5,13Z" />
    </FlatIconOutline>
  );
}
