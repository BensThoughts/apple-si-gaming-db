interface CardProps {
  title?: string;
  children: React.ReactNode;
}

export default function Card({
  title,
  children,
}: CardProps) {
  return (
    <div className="block bg-tertiary border-1 border-secondary-highlight rounded-md p-4 w-full">
      {title && <h2 className="text-secondary text-2xl">{title}</h2>}
      {children}
    </div>
  );
}
