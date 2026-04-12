"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link } from "@/i18n/navigation";

export type ContactFormLabels = {
  title: string;
  name: string;
  email: string;
  message: string;
  submit: string;
  close: string;
  success: string;
  hint: string;
  sending: string;
  errorGeneric: string;
  errorNoOwner: string;
  errorOwnListing: string;
  backToSearch: string;
};

type ListingContactContextValue = {
  open: () => void;
  enabled: boolean;
};

const ListingContactContext = createContext<ListingContactContextValue | null>(null);

export function useListingContact() {
  const v = useContext(ListingContactContext);
  if (!v) {
    throw new Error("useListingContact outside ListingContactRoot");
  }
  return v;
}

type RootProps = {
  listingSlug: string;
  listingTitle: string;
  labels: ContactFormLabels;
  contactEnabled: boolean;
  children: ReactNode;
};

export function ListingContactRoot({
  listingSlug,
  listingTitle,
  labels,
  contactEnabled,
  children,
}: RootProps) {
  const [open, setOpen] = useState(false);
  const openFn = useCallback(() => {
    if (contactEnabled) setOpen(true);
  }, [contactEnabled]);

  return (
    <ListingContactContext.Provider value={{ open: openFn, enabled: contactEnabled }}>
      {children}
      {open ? (
        <ContactSheet
          listingSlug={listingSlug}
          listingTitle={listingTitle}
          labels={labels}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </ListingContactContext.Provider>
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
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    setLoading(true);
    setErrorKey(null);
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(listingSlug)}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      let data: { error?: string } = {};
      try {
        data = (await res.json()) as { error?: string };
      } catch {
        /* ignore */
      }

      if (!res.ok) {
        if (data.error === "no_owner") setErrorKey("no_owner");
        else if (data.error === "own_listing") setErrorKey("own_listing");
        else setErrorKey("generic");
        return;
      }

      setSent(true);
      form.reset();
    } catch {
      setErrorKey("generic");
    } finally {
      setLoading(false);
    }
  }

  const errorText =
    errorKey === "no_owner"
      ? labels.errorNoOwner
      : errorKey === "own_listing"
        ? labels.errorOwnListing
        : errorKey === "generic"
          ? labels.errorGeneric
          : null;

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
          <div className="mt-8 space-y-4">
            <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
              {labels.success}
            </p>
            <Link
              href="/suche"
              onClick={onClose}
              className="inline-flex text-sm font-semibold text-bd-primary hover:text-bd-primary-hover dark:text-teal-300"
            >
              {labels.backToSearch}
            </Link>
          </div>
        ) : (
          <form className="mt-6 flex flex-col gap-4" onSubmit={(e) => void onSubmit(e)}>
            <input type="hidden" name="slug" value={listingSlug} readOnly />
            {errorText ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
                {errorText}
              </p>
            ) : null}
            <div>
              <label htmlFor="ct-name" className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {labels.name}
              </label>
              <input
                id="ct-name"
                name="name"
                required
                autoComplete="name"
                disabled={loading}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
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
                disabled={loading}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
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
                disabled={loading}
                className="mt-1 w-full resize-y rounded-lg border border-zinc-300 px-3 py-2 text-sm disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-lg bg-bd-primary py-3 text-sm font-semibold text-bd-primary-fg hover:bg-bd-primary-hover disabled:opacity-60"
            >
              {loading ? labels.sending : labels.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
