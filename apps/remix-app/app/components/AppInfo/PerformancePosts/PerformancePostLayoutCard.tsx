export default function PostLayoutCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-tertiary p-3 rounded-lg">
      {children}
    </div>
  );
}
