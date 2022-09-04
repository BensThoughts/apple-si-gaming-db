import AnimatedUnderline from '../AnimatedUnderline';

export default function LoginCard({
  isLoggedIn,
  displayName,
  avatarFull,
}: {
  isLoggedIn: boolean;
  avatarFull?: string | null;
  displayName?: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 border-secondary-highlight border-solid border-2 w-full max-w-md rounded">
      {isLoggedIn ? (
        <>
          <h2><strong>{displayName}</strong></h2>
          {avatarFull && <img
            src={avatarFull}
            alt={`User Profile`}
          />}
          <a
            href='/api/auth/steam/logout'
          >
            <AnimatedUnderline>Logout</AnimatedUnderline>
          </a>
        </>
      ): (
        <>
          <h2 className="text-center"><strong>Sign In</strong></h2>
          Apple Silicon on Steam requires Steam authentication to verify that user reports are
          written by people that own the game. Signing in with this method accesses only information
          that you have intentionally set to be publicly visible.
          <a href='/api/auth/steam/login' className="block w-[114px] h-[43px]">
            <div className='w-[114px] h-[43px]'>
              <img
                src='steam_sign_in.png'
                alt='sign in with steam'
                width={114}
                height={43}
              />
            </div>
          </a>
        </>
      )}
    </div>
  );
}
