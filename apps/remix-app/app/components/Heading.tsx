export default function Heading({
  children,
}: {
  children: string;
}) {
  return (
    <div
      // className={`mt-4
      // after:w-full after:max-w-[80px] after:h-[2px] after:block after:relative
      // after:top-0 after:left-0 after:bg-secondary
      // after:-translate-y-4 after:-translate-x-[110%]

      // before:w-full before:max-w-[80px] before:h-[2px] before:block before:relative
      // before:top-0 before:right-0 before:bg-secondary
      // before:translate-y-4 before:translate-x-[110%]`}
    >
      <h2 className="text-secondary text-2xl">{children}</h2>
    </div>
  );
}
