import PageWrapper from '~/components/Layout/PageWrapper';

export default function LoggedOutPage() {
  return (
    <PageWrapper topSpacer>
      <div className="flex flex-col gap-4 w-full h-[calc(100vh_-_14rem)] items-center justify-center">
        <h1 className="text-4xl md:text-6xl text-primary-highlight">You Logged Out</h1>
        <p>
          You can click the login with Steam icon here to log back in again.
        </p>
        <a
          href="/api/auth/steam/login"
          className="block w-[114px] h-[43px] mt-2"
        // onClick={() => Fathom.trackGoal('7HVQUUZ4', 1)}
        >
          <img
            src="/steam_sign_in.png"
            alt="login with steam"
            width={114}
            height={43}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
            }}
          />
        </a>
        {/* <p>Error in {currentRoute} route</p> */}
      </div>
    </PageWrapper>
  );
}
