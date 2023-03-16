// import * as Fathom from 'fathom-client';

export default function LoginCard() {
  return (
    <div className={`flex flex-col items-center gap-6 p-6
                      w-full max-w-md rounded-lg text-lg`}>
      <h2 className="text-center text-3xl"><strong>Login</strong></h2>
      <span className="text-center">
        Apple Silicon on Steam requires Steam authentication to post performance reports.
        Signing in with this method accesses only information that you have intentionally
        set to be publicly visible.
        <span className="text-secondary">&nbsp;Click the icon to login.</span>
      </span>
      <a
          href="/api/auth/steam/login"
          className="outline-none focus-visible:show-ring rounded-lg mt-2"
          // onClick={() => Fathom.trackGoal('7HVQUUZ4', 1)}
        >
      <div className="p-5 border-solid border-secondary-highlight border-y-2 rounded-xl bg-tertiary-highlight">

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
      </div>
      </a>

    </div>
  );
}
