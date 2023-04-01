// import SignInBannerAlert from '~/components/Banners/SignInBannerAlert';
import { useTheme } from '~/lib/context/theme-provider';
import { classNames } from '~/lib/css/classNames';
import PageFooter from './PageFooter';
import PageHeader from './PageHeader';
import PageMain from './PageMain';

function Background() {
  const [currentTheme] = useTheme();
  let bgImageCss = `bg-[url('/svg-images/layered-waves-light.svg')]`;
  if (currentTheme === 'dark') {
    bgImageCss = `bg-[url('/svg-images/layered-waves-dark.svg')]`;
  }
  return (
    <>
      <div
        className={classNames(
            'absolute top-0 bg-no-repeat bg-cover -z-50',
            'max-h-[calc(100vh_-_3.5rem)] min-h-[540px] w-screen',
            bgImageCss,
        )}
      />
    </>
  );
}

type PageProps = {
  title?: string;
  topSpacer?: boolean;
  children: React.ReactNode;
}

export default function PageWrapper({
  title,
  topSpacer = false,
  children,
}: PageProps) {
  return (
    <div className="flex flex-col justify-between h-[calc(100vh_-_3.5rem)]">
      <div className="relative">
        {title && <PageHeader title={title} titlePosition="left" />}
        {/* <div className="sticky z-[999] top-[3.5rem] flex justify-center items-center w-full">
          <div className="w-full max-w-5xl px-4 mt-2">
            <SignInBannerAlert showBanner={true} />
          </div>
        </div> */}

        {topSpacer && <div className="mb-4 md:mb-6" />}

        <PageMain>
          {children}
        </PageMain>
        <Background />
      </div>
      <PageFooter className="mt-10 md:mt-20" />
    </div>
  );
}
