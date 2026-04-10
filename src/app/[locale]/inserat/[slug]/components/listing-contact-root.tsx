"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

export type ContactFormLabels = {
  title: string;
  name: string;
  email: string;
  message: string;
  submit: string;
  close: string;
  success: string;
  hint: string;
};

const ContactOpenContext = createContext<(() => void) | null>(null);

export function useOpenListingContact() {
  const fn = useContext(ContactOpenContext);
  if (!fn) {
    throw new Error("useOpenListingContact outside ListingContactRoot");
  }
  return fn;
}

type RootProps = {
  listingSlug: string;
  listingTitle: string;
  labels: ContactFormLabels;
  children: ReactNode;
};

export function ListingContactRoot({ listingSlug, listingTitle, labels, children }: RootProps) {
  const [open, setOpen] = useState(false);
  const openFn = useCallback(() => setOpen(true), []);

  return (
    <ContactOpenContext.Provider value={openFn}>
      {children}
      {open ? (
        <ContactSheet
          listingSlug={listingSlug}
          listingTitle={listingTitle}
          labels={labels}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </ContactOpenContext.Provider>
  );
}

function ContactSheet({
  listingSlug,
  listingTitle,
  labels,
  onClose,
}: {
  listingSlug: string;
  listingTitle: string;
  labels: ContactFormLabels;
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal>
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm"
        aria-label={labels.close}
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-t-2xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-float)] dark:border-zinc-700 dark:bg-zinc-900 sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{labels.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{listingTitle}</p>
            <p className="mt-1 text-xs text-zinc-500">{labels.hint}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label={labels.close}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {sent ? (
          <p className="mt-8 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
            {labels.success}
          </p>
        ) : (
          <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
            <input type="hidden" name="slug" value={listingSlug} readOnly />
            <div>
              <label htmlFor="ct-name" className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {labels.name}
              </label>
              <input
                id="ct-name"
                name="name"
                required
                autoComplete="name"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            <div>
              <label htmlFor="ct-email" className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {labels.email}
              </label>
              <input
                id="ct-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            <div>
              <label htmlFor="ct-msg" className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {labels.message}
              </label>
              <textarea
                id="ct-msg"
                name="message"
                required
                rows={4}
                className="mt-1 w-full resize-y rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            <button
              type="submit"
              className="mt-2 rounded-lg bg-bd-primary py-3 text-sm font-semibold text-bd-primary-fg hover:bg-bd-primary-hover"
            >
              {labels.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
