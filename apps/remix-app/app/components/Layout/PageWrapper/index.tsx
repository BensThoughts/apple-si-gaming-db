import { useTheme } from '~/lib/context/theme-provider';
import PageFooter from './PageFooter';
import PageHeader from './PageHeader';
import PageMain from './PageMain';
import TopSpacer from './TopSpacer';

function Background() {
  const [currentTheme] = useTheme();
  let bgImageCss = `bg-[url('/svg-images/layered-waves-light.svg')]`;
  if (currentTheme === 'dark') {
    bgImageCss = `bg-[url('/svg-images/layered-waves-dark.svg')]`;
  }
  return (
    <>
      <div
        className={`absolute top-0 bg-no-repeat bg-cover
                    max-h-[calc(100vh_-_3.5rem)] min-h-[540px] w-screen
                    -z-50 ${bgImageCss} bg-cover`}
      />
    </>
  );
}

type PageProps = {
  title?: string;
  topSpacer?: boolean;
} & React.HTMLAttributes<HTMLDivElement>

export default function PageWrapper({
  title,
  topSpacer = false,
  children,
}: PageProps) {
  return (
    <div className="flex flex-col justify-between h-[calc(100vh_-_3.5rem)]">
      <div className="relative">
        {title && <PageHeader title={title} titlePosition="left" />}
        {topSpacer && <TopSpacer />}
        <PageMain>
          {children}
        </PageMain>
        <Background />
      </div>
      <PageFooter className="mt-20" />
    </div>
  );
}