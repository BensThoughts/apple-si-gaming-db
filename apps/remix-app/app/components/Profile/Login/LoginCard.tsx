// import * as Fathom from 'fathom-client';

export default function LoginCard() {
  return (
    <div className={`flex flex-col items-center gap-4 p-6
                     border-secondary-highlight border-solid
                     border-y-2 md:border-x-2 w-full max-w-md
                     rounded-lg`}>
      <h2 className="text-center"><strong>Login</strong></h2>
        Apple Silicon on Steam requires Steam authentication to post performance reports.
        Signing in with this method accesses only information that you have intentionally
        set to be publicly visible.
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
    </div>
  );
}
