import PageWrapper from '~/components/Layout/PageWrapper';

export default function Index() {
  return (
    <PageWrapper>
      <div className="relative sm:flex sm:items-center sm:justify-center">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-32">
            <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
              <span className="block uppercase text-primary-highlight drop-shadow-md">
                  Apple Silicon on Steam
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-center text-xl text-primary sm:max-w-3xl">
                Write and read user experience reports about steam games running on apple silicon from users verified to own the game.
            </p>
          </div>
        </div>


      </div>
    </PageWrapper>
  );
}
