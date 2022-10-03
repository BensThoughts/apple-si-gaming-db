import { useContext } from 'react';
import { ThemeContext } from '~/lib/context/colorMode';
import PageFooter from './PageFooter';
import PageHeader from './PageHeader';
import PageMain from './PageMain';

type PageProps = { title?: string; } & React.HTMLAttributes<HTMLDivElement>

function Background() {
  const { colorMode } = useContext(ThemeContext);
  if (colorMode === 'dark') {
    return (
      <>
        <div
          className="absolute top-0 bg-no-repeat bg-cover rotate-180 max-h-screen
                     bg-[url('/svg-images/layered-waves-dark.svg')] aspect-[3/2]
                     w-full -z-50"
        />
      </>
    );
  }
  return (
    <>
      <div
        className="absolute top-0 bg-no-repeat bg-cover rotate-180 max-h-screen
                   bg-[url('/svg-images/layered-waves-light.svg')] aspect-[3/2]
                   w-full -z-50"
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
      <div>
        {title && <PageHeader title={title} titlePosition="left" className="mb-4 md:mb-8" />}
        <PageMain className="mt-4 md:mt-12 mb-10">
          {children}
        </PageMain>
        <Background />
      </div>
      <PageFooter className="mt-10" />
    </div>
  );
}
