export default function Heading({
  children,
}: {
  children: string;
}) {
  return (
    <div>
      <h2 className="text-secondary text-2xl">{children}</h2>
    </div>
  );
}
