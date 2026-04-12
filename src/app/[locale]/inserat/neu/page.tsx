import { auth } from "@/auth";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NewListingForm } from "./components/new-listing-form";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "listingNew" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function NewListingPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const typ = typeof sp.typ === "string" ? sp.typ : Array.isArray(sp.typ) ? sp.typ[0] : undefined;
  const kindParam = typeof sp.kind === "string" ? sp.kind : Array.isArray(sp.kind) ? sp.kind[0] : undefined;
  const defaultKind = kindParam === "buy" || typ === "kaufen" ? "buy" : "rent";

  const query = new URLSearchParams();
  if (typ) query.set("typ", typ);
  if (kindParam) query.set("kind", kindParam);
  const qs = query.toString();
  const callbackPath = `/inserat/neu${qs ? `?${qs}` : ""}`;

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/anmelden?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }

  const t = await getTranslations("listingNew");

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{t("pageTitle")}</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t("pageSubtitle")}</p>
      <div className="mt-10">
        <NewListingForm defaultKind={defaultKind} />
      </div>
    </main>
  );
}
