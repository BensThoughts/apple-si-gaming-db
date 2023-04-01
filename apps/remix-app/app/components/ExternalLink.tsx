import { classNames } from '~/lib/css/classNames';

type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

export default function ExternalLink({
  href,
  children,
  className,
  ...rest
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className={classNames(
          'underline underline-offset-4 hover:text-tertiary rounded-sm',
          'transition-colors duration-200 focus-visible:show-ring-tertiary',
          className ? className : '',
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
