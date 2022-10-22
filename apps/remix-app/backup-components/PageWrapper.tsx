import { useContext } from 'react';
import { ThemeContext } from '~/lib/context/colorMode';
import PageFooter from '~/components/Layout/PageFooter';
import PageHeader from '~/components/Layout/PageHeader';
import PageMain from '~/components/Layout/PageMain';

type PageProps = { title?: string; } & React.HTMLAttributes<HTMLDivElement>

function Background() {
  const { colorMode } = useContext(ThemeContext);
  let bgImageCss = `bg-[url('/svg-images/layered-waves-light.svg')]`;
  if (colorMode === 'dark') {
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

export default function PageWrapper({
  title,
  children,
}: PageProps) {
  return (
    <div className="flex flex-col justify-between h-[calc(100vh_-_3.5rem)]">
      <div className="relative">
        {title && <PageHeader title={title} titlePosition="left" className="mb-4 md:mb-12" />}
        <PageMain>
          {children}
        </PageMain>
        <Background />
      </div>
      <PageFooter className="mt-20" />
    </div>
  );
}
