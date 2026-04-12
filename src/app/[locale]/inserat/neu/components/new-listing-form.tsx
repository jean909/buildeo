"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useState, type FormEvent } from "react";

export function NewListingForm() {
  const t = useTranslations("listingNew");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") ?? ""),
      city: String(fd.get("city") ?? ""),
      postalCode: String(fd.get("postalCode") ?? ""),
      kind: String(fd.get("kind") ?? "rent"),
      rooms: String(fd.get("rooms") ?? ""),
      livingAreaM2: String(fd.get("livingAreaM2") ?? ""),
      priceEur: String(fd.get("priceEur") ?? ""),
      description: String(fd.get("description") ?? ""),
      coverImageUrl: String(fd.get("coverImageUrl") ?? ""),
      lat: String(fd.get("lat") ?? ""),
      lng: String(fd.get("lng") ?? ""),
      isNew: fd.get("isNew") === "on",
    };

    setPending(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          lat: payload.lat.trim() ? Number(payload.lat) : undefined,
          lng: payload.lng.trim() ? Number(payload.lng) : undefined,
          coverImageUrl: payload.coverImageUrl.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { error?: string; slug?: string };
      if (!res.ok) {
        if (res.status === 401) setError(t("errorAuth"));
        else setError(t("errorSave"));
        return;
      }
      if (data.slug) {
        router.push(`/inserat/${data.slug}`);
        router.refresh();
        return;
      }
      setError(t("errorSave"));
    } catch {
      setError(t("errorSave"));
    } finally {
      setPending(false);
    }
  }

  const input =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100";
  const label = "text-xs font-medium text-zinc-500 dark:text-zinc-400";

  return (
    <form className="mx-auto max-w-xl space-y-5" onSubmit={(e) => void onSubmit(e)}>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <div>
        <label htmlFor="nl-title" className={label}>
          {t("title")}
        </label>
        <input id="nl-title" name="title" required minLength={3} maxLength={120} className={input} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nl-city" className={label}>
            {t("city")}
          </label>
          <input id="nl-city" name="city" required minLength={2} className={input} />
        </div>
        <div>
          <label htmlFor="nl-plz" className={label}>
            {t("postalCode")}
          </label>
          <input id="nl-plz" name="postalCode" required minLength={2} maxLength={12} className={input} />
        </div>
      </div>

      <div>
        <label htmlFor="nl-kind" className={label}>
          {t("kind")}
        </label>
        <select id="nl-kind" name="kind" className={input} defaultValue="rent">
          <option value="rent">{t("kindRent")}</option>
          <option value="buy">{t("kindBuy")}</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="nl-rooms" className={label}>
            {t("rooms")}
          </label>
          <input id="nl-rooms" name="rooms" type="number" inputMode="decimal" step="0.5" min="0.5" max="20" required className={input} />
        </div>
        <div>
          <label htmlFor="nl-area" className={label}>
            {t("livingArea")}
          </label>
          <input id="nl-area" name="livingAreaM2" type="number" inputMode="numeric" min="5" max="50000" required className={input} />
        </div>
        <div>
          <label htmlFor="nl-price" className={label}>
            {t("priceEur")}
          </label>
          <input id="nl-price" name="priceEur" type="number" inputMode="numeric" min="1" required className={input} />
        </div>
      </div>

      <div>
        <label htmlFor="nl-desc" className={label}>
          {t("description")}
        </label>
        <textarea
          id="nl-desc"
          name="description"
          required
          minLength={10}
          maxLength={8000}
          rows={6}
          className={input}
        />
      </div>

      <div>
        <label htmlFor="nl-cover" className={label}>
          {t("coverUrl")}
        </label>
        <input id="nl-cover" name="coverImageUrl" type="url" placeholder="https://…" className={input} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nl-lat" className={label}>
            {t("latOptional")}
          </label>
          <input id="nl-lat" name="lat" type="number" step="any" min="-90" max="90" className={input} />
        </div>
        <div>
          <label htmlFor="nl-lng" className={label}>
            {t("lngOptional")}
          </label>
          <input id="nl-lng" name="lng" type="number" step="any" min="-180" max="180" className={input} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input type="checkbox" name="isNew" className="rounded border-zinc-300" />
        {t("isNew")}
      </label>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-bd-primary px-5 py-2.5 text-sm font-semibold text-bd-primary-fg hover:bg-bd-primary-hover disabled:opacity-60"
        >
          {pending ? "…" : t("submit")}
        </button>
        <Link href="/suche" className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800">
          {t("cancel")}
        </Link>
      </div>
    </form>
  );
}
