import type { RemixLinkProps } from '@remix-run/react/dist/components';
import { Link } from '@remix-run/react';
import { classNames } from '~/lib/css/classNames';

type RoundedButtonRemixLinkProps = {
  width: 'wide' | 'regular',
} & RemixLinkProps;

export default function RoundedButtonRemixLink({
  width = 'regular',
  to,
  className,
  children,
  ...rest
}: RoundedButtonRemixLinkProps) {
  return (
    <Link
      to={to}
      className={classNames(
          'text-sm text-primary-highlight inline-flex justify-center items-center',
          'border border-transparent font-medium px-4 py-2 rounded',
          'bg-secondary hover:bg-secondary-highlight focus-visible:bg-secondary-highlight',
          'focus-visible:show-ring h-[38px]',
          width === 'regular' ? 'w-[89.66px]' : 'w-[128px]',
          className ? className : '',
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
