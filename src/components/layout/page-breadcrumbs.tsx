import { Link } from "@/i18n/navigation";

export type Crumb = { href?: string; label: string };

export function PageBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 dark:text-zinc-400">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 ? (
              <span className="text-zinc-300 dark:text-zinc-600" aria-hidden>
                /
              </span>
            ) : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-bd-primary dark:hover:text-teal-300">
                {item.label}
              </Link>
            ) : (
              <span className="max-w-[min(100%,280px)] truncate font-medium text-zinc-800 dark:text-zinc-100">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
