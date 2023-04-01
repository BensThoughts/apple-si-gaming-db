import { classNames } from '~/lib/css/classNames';

type PageHeaderProps = {
  title: string;
  titlePosition: 'left' | 'center';
} & React.HTMLAttributes<HTMLDivElement>

export default function PageHeader({
  title,
  titlePosition,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={classNames(
          'w-full min-h-[52px] bg-app-bg-secondary py-2 px-6',
          className ? className : '',
      )}
    >
      <h1
        className={classNames(
            'text-2xl md:text-3xl text-secondary',
            titlePosition === 'left' ? 'text-left' : 'text-center',
        )}
      >
        {title}
      </h1>
    </header>
  );
}
