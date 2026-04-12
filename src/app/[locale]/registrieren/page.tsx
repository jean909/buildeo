"use client";

import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Link, useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { safeCallbackPathFromWindow } from "@/lib/safe-callback-path";

export default function RegistrierenPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [signInHref, setSignInHref] = useState("/anmelden");

  useEffect(() => {
    setSignInHref(`/anmelden${window.location.search}`);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? t("registerError"));
        setPending(false);
        return;
      }
      const sign = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (sign?.error) {
        setError(t("signInAfterRegisterError"));
        setPending(false);
        return;
      }
      router.push(safeCallbackPathFromWindow());
      router.refresh();
    } catch {
      setError(t("registerError"));
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{t("registerTitle")}</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t("registerSubtitle")}</p>

      <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="name" className="text-xs font-medium text-zinc-500">
            {t("nameOptional")}
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-xs font-medium text-zinc-500">
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-xs font-medium text-zinc-500">
            {t("passwordMin")}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-bd-primary py-2.5 text-sm font-semibold text-bd-primary-fg hover:bg-bd-primary-hover disabled:opacity-60"
        >
          {pending ? "…" : t("registerSubmit")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        {t("hasAccount")}{" "}
        <Link href={signInHref} className="font-semibold text-bd-primary dark:text-teal-300">
          {t("signIn")}
        </Link>
      </p>
    </main>
  );
}
