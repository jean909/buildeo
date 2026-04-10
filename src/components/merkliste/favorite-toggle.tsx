"use client";

import { useMerkliste } from "./merkliste-provider";

type Props = {
  slug: string;
  labelAdd: string;
  labelRemove: string;
  className?: string;
};

export function FavoriteToggle({ slug, labelAdd, labelRemove, className = "" }: Props) {
  const { has, toggle, ready } = useMerkliste();
  const active = has(slug);
  const label = active ? labelRemove : labelAdd;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      disabled={!ready}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-lg border border-white/80 bg-white/95 text-zinc-600 shadow-md backdrop-blur-sm transition hover:bg-white hover:text-red-600 dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-300 dark:hover:text-red-400 ${active ? "text-red-600 dark:text-red-400" : ""} ${className}`}
    >
      {active ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17l-.022.012-.007.003-.003.001a.75.75 0 01-.673 0l-.003-.001z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      )}
    </button>
  );
}
