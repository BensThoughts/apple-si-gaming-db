import { classNames } from '~/lib/css/classNames';

type SpinnerSize = 'small' | 'medium' | 'large';

export default function LoadingSpinner({
  size = 'medium',
  className,
}: {
  size?: SpinnerSize;
  className?: string;
}) {
  // const bSize = String(borderSize);
  let border = 'border-b-[2px]';
  let sizeCSS = 'w-3 h-3';

  switch (size) {
    case 'small':
      sizeCSS = 'w-3 h-3';
      border = 'border-b-[2px]';
      break;
    case 'medium':
      sizeCSS = 'w-8 h-8';
      border = 'border-b-[2px]';
      break;
    case 'large':
      sizeCSS = 'w-16 h-16';
      border = 'border-b-[4px]';
      break;
  }

  return (
    <div className="flex justify-center items-center">
      <div className={classNames(
          'rounded-full border-l-2 animate-spin',
          sizeCSS, border, 'border-primary',
          className ? className : '',
      )}
      />
    </div>
  );
}
