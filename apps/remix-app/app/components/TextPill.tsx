export default function TextPill({
  children,
}: {
  children: string,
}) {
  return (
    <div className="flex justify-center items-center p-1 text-sm rounded-md bg-secondary">
      {children}
    </div>
  );
};
