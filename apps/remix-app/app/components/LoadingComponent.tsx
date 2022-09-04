import LoadingSpinner from './LoadingSpinner';

export default function LoadingComponent() {
  return (
    <div className="flex flex-col gap-2 w-full h-full justify-center items-center">
      <h2>Loading...</h2>
      <LoadingSpinner size="large" />
    </div>
  );
}
