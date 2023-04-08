export default function PostLayoutCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-tertiary px-4 py-5 rounded-lg">
      {children}
    </div>
  );
}
