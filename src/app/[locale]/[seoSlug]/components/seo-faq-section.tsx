import { buildSeoFaqItems, type ResolvedSeoPage } from "@/lib/seo";

export function SeoFaqSection({ page }: { page: ResolvedSeoPage }) {
  const faqs = buildSeoFaqItems(page);

  return (
    <section
      aria-labelledby="seo-faq-heading"
      className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-card)] sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-bd-primary dark:text-teal-300">
        Häufige Fragen (FAQ)
      </span>
      <h2
        id="seo-faq-heading"
        className="mt-1 text-xl font-semibold text-zinc-900 sm:text-2xl dark:text-zinc-50"
      >
        Wichtige Fragen rund um {page.intent.label} in {page.locationName}
      </h2>

      <dl className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
        {faqs.map((faq) => (
          <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
            <dt className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {faq.question}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {faq.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
