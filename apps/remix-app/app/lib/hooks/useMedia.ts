import { useMedia } from 'react-use';

export function useMediaIsWide() {
  const isWide = useMedia('(min-width: 768px)');
  return { isWide };
}
