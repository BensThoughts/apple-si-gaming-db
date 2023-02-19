export default function PostLayoutCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 w-full
    bg-tertiary border-solid border-2 border-secondary
    p-3 rounded-lg"
    >
      {children}
    </div>
  );
}
