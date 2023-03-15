import type { ThrownResponse } from '@remix-run/react';
import PageWrapper from './PageWrapper';

const MainCatchDisplay = ({
  thrownResponse,
}: {
  thrownResponse: ThrownResponse<number, any>
}) => {
  const {
    status,
    statusText,
    data,
  } = thrownResponse;
  return (
    <div className="flex flex-col gap-4 w-full h-[calc(100vh_-_14rem)] items-center justify-center">
      <h1 className="text-4xl md:text-6xl text-primary-highlight">Oops! - {status} Error</h1>
      <p>{statusText} - {data}</p>
      {/* <p>Error in {currentRoute} route</p> */}
    </div>
  );
};

export default function CatchDisplay({
  includePageWrap,
  currentRoute,
  thrownResponse,
}: {
  includePageWrap: boolean;
  currentRoute: string;
  thrownResponse: ThrownResponse<number, any>;
}) {
  if (includePageWrap) {
    return (
      <PageWrapper currentRoute={currentRoute} topSpacer>
        <MainCatchDisplay thrownResponse={thrownResponse} />
      </PageWrapper>
    );
  }
  return <MainCatchDisplay thrownResponse={thrownResponse} />;
}
