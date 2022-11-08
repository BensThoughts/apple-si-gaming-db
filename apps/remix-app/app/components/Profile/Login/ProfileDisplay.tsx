import AnimatedUnderline from '~/components/AnimatedUnderline';

export default function ProfileDisplay({
  isLoggedIn,
  displayName,
  avatarFull,
}: {
  isLoggedIn: boolean;
  avatarFull?: string | null;
  displayName?: string | null;
}) {
  return (
    <div className={`flex flex-col items-center gap-4 p-6
                     border-secondary-highlight border-solid
                     border-y-2 md:border-x-2 w-full max-w-md
                     rounded-lg`}>
      {isLoggedIn ? (
        <>
          <h2><strong>{displayName}</strong></h2>
          {avatarFull && <img
            src={avatarFull}
            alt="Current User Avatar"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
            }}
          />}
          <a
            href="/api/auth/steam/logout"
          >
            <AnimatedUnderline>Logout</AnimatedUnderline>
          </a>
        </>
      ): (
        <>
          <h2 className="text-center"><strong>Sign In</strong></h2>
          Apple Silicon on Steam requires Steam authentication to post performance reports.
          Signing in with this method accesses only information that you have intentionally
          set to be publicly visible.
          <a href="/api/auth/steam/login" className="block w-[114px] h-[43px] mt-2">
            <img
              src="steam_sign_in.png"
              alt="sign in with steam"
              width={114}
              height={43}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/svg-images/no-image-placeholder.svg';
              }}
            />
          </a>
        </>
      )}
    </div>
  );
}
