import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export type InquiryListRow = {
  id: string;
  createdAt: Date;
  fromName: string;
  fromEmail: string;
  message: string;
  listing: { slug: string; title: string };
};

export async function InquiryList({ rows }: { rows: InquiryListRow[] }) {
  const t = await getTranslations("inquiries");

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-600 dark:bg-zinc-900">
        <p className="text-zinc-600 dark:text-zinc-400">{t("empty")}</p>
        <Link
          href="/suche"
          className="mt-6 inline-flex rounded-lg bg-bd-primary px-5 py-2.5 text-sm font-semibold text-bd-primary-fg hover:bg-bd-primary-hover"
        >
          {t("goSearch")}
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {rows.map((row) => (
        <li
          key={row.id}
          className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[var(--shadow-bd-card)] dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <Link
              href={`/inserat/${row.listing.slug}`}
              className="text-sm font-semibold text-bd-primary hover:text-bd-primary-hover dark:text-teal-300"
            >
              {row.listing.title}
            </Link>
            <time className="text-xs text-zinc-500 tabular-nums" dateTime={row.createdAt.toISOString()}>
              {row.createdAt.toLocaleString("de-DE", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </time>
          </div>
          <p className="mt-2 text-sm text-zinc-800 dark:text-zinc-200">
            <span className="font-medium">{row.fromName}</span>
            <span className="text-zinc-500"> · </span>
            <a href={`mailto:${row.fromEmail}`} className="text-bd-primary hover:underline dark:text-teal-300">
              {row.fromEmail}
            </a>
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{row.message}</p>
        </li>
      ))}
    </ul>
  );
}
