import { classNames } from '~/lib/css/classNames';

export default function TextPill({
  children,
  className,
}: {
  children: string,
  className?: string,
}) {
  return (
    <div
      className={classNames(
          'flex justify-center items-center py-1 px-2 text-xs',
          'rounded-md border-solid border-1 border-secondary',
          'select-none max-w-fit shadow-md h-6',
          className ? className : '',
      )}
    >
      {children}
    </div>
  );
};
