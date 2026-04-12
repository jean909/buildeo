"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useCallback, useState, type FormEvent } from "react";

type FormProps = {
  defaultKind: "rent" | "buy";
};

export function NewListingForm({ defaultKind }: FormProps) {
  const t = useTranslations("listingNew");
  const router = useRouter();
  const [kind, setKind] = useState<"rent" | "buy">(defaultKind);
  const [descLen, setDescLen] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onDescInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    setDescLen(e.currentTarget.value.length);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") ?? ""),
      city: String(fd.get("city") ?? ""),
      postalCode: String(fd.get("postalCode") ?? ""),
      kind: String(fd.get("kind") ?? kind),
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
          lat: payload.lat.trim() ? Number(payload.lat.replace(",", ".")) : undefined,
          lng: payload.lng.trim() ? Number(payload.lng.replace(",", ".")) : undefined,
          coverImageUrl: payload.coverImageUrl.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { error?: string; slug?: string };
      if (!res.ok) {
        const c = data.error;
        const msg =
          c === "cover_invalid"
            ? t("errorCoverUrl")
            : c === "coords_partial"
              ? t("errorCoordsPair")
              : c === "slug_conflict"
                ? t("errorSlug")
                : c === "validation"
                  ? t("errorValidation")
                  : c === "server"
                    ? t("errorServer")
                    : c === "unauthorized"
                      ? t("errorAuth")
                      : t("errorSave");
        setError(msg);
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
  const section = "rounded-xl border border-zinc-200 bg-white/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/50";
  const priceLabel = kind === "rent" ? t("priceRent") : t("priceBuy");

  return (
    <form className="mx-auto max-w-xl space-y-8" onSubmit={(e) => void onSubmit(e)}>
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
        >
          {error}
        </p>
      ) : null}

      <fieldset className={section}>
        <legend className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{t("sectionBasics")}</legend>
        <div className="mt-4 space-y-4">
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
              <input id="nl-city" name="city" required minLength={2} className={input} autoComplete="address-level2" />
            </div>
            <div>
              <label htmlFor="nl-plz" className={label}>
                {t("postalCode")}
              </label>
              <input
                id="nl-plz"
                name="postalCode"
                required
                minLength={4}
                maxLength={8}
                inputMode="numeric"
                pattern="[0-9]{4,8}"
                className={input}
                autoComplete="postal-code"
              />
            </div>
          </div>

          <div>
            <label htmlFor="nl-kind" className={label}>
              {t("kind")}
            </label>
            <select
              id="nl-kind"
              name="kind"
              className={input}
              value={kind}
              onChange={(e) => setKind(e.target.value === "buy" ? "buy" : "rent")}
            >
              <option value="rent">{t("kindRent")}</option>
              <option value="buy">{t("kindBuy")}</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="nl-rooms" className={label}>
                {t("rooms")}
              </label>
              <input
                id="nl-rooms"
                name="rooms"
                type="text"
                inputMode="decimal"
                required
                placeholder="3,5"
                className={input}
              />
            </div>
            <div>
              <label htmlFor="nl-area" className={label}>
                {t("livingArea")}
              </label>
              <input
                id="nl-area"
                name="livingAreaM2"
                type="text"
                inputMode="numeric"
                required
                placeholder="85"
                className={input}
              />
            </div>
            <div>
              <label htmlFor="nl-price" className={label}>
                {priceLabel}
              </label>
              <input
                id="nl-price"
                name="priceEur"
                type="text"
                inputMode="numeric"
                required
                placeholder={kind === "rent" ? "1200" : "450000"}
                className={input}
              />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className={section}>
        <legend className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{t("sectionDetails")}</legend>
        <div className="mt-4 space-y-2">
          <label htmlFor="nl-desc" className={label}>
            {t("description")}
          </label>
          <textarea
            id="nl-desc"
            name="description"
            required
            minLength={10}
            maxLength={8000}
            rows={8}
            className={input}
            onInput={onDescInput}
          />
          <p className="text-right text-xs text-zinc-500 tabular-nums">{t("charCount", { count: descLen })}</p>
        </div>
      </fieldset>

      <fieldset className={section}>
        <legend className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{t("sectionMedia")}</legend>
        <div className="mt-4 space-y-2">
          <label htmlFor="nl-cover" className={label}>
            {t("coverUrl")}
          </label>
          <input id="nl-cover" name="coverImageUrl" type="url" placeholder="https://…" className={input} />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("coverHint")}</p>
        </div>
      </fieldset>

      <fieldset className={section}>
        <legend className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{t("sectionLocationOptional")}</legend>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{t("coordsHint")}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nl-lat" className={label}>
              {t("latOptional")}
            </label>
            <input id="nl-lat" name="lat" type="text" inputMode="decimal" placeholder="52.52" className={input} />
          </div>
          <div>
            <label htmlFor="nl-lng" className={label}>
              {t("lngOptional")}
            </label>
            <input id="nl-lng" name="lng" type="text" inputMode="decimal" placeholder="13.405" className={input} />
          </div>
        </div>
      </fieldset>

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
          {pending ? t("submitting") : t("submit")}
        </button>
        <Link
          href="/suche"
          className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          {t("cancel")}
        </Link>
      </div>
    </form>
  );
}
