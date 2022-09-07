export default function TextPill({
  children,
}: {
  children: string,
}) {
  return (
    <div className={`flex justify-center items-center py-1 px-2 text-xs
                     rounded-md border-solid border-1 border-secondary`}>
      {children}
    </div>
  );
};
