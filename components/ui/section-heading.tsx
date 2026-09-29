import Link from "next/link";

export function SectionHeading({
  title,
  subtitle,
  href
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight text-[color:var(--store-text)] sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-0.5 max-w-2xl text-xs text-[color:var(--store-text-muted)] sm:text-sm">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="store-link text-sm font-semibold">
          See all
        </Link>
      )}
    </div>
  );
}
