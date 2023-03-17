import { useMedia } from 'react-use';

export function useMediaIsWide(defaultValue: boolean) {
  const isWide = useMedia('(min-width: 768px)', defaultValue);
  return isWide;
}
