import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { InquiryList, type InquiryListRow } from "./components/inquiry-list";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "inquiries" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function AnfragenPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/anmelden");
  }

  const t = await getTranslations("inquiries");

  type InquiryRow = Prisma.ContactInquiryGetPayload<{
    include: { listing: { select: { title: true; slug: true } } };
  }>;

  let dbUnavailable = false;
  let raw: InquiryRow[] = [];
  try {
    raw = await prisma.contactInquiry.findMany({
      where: { listing: { ownerId: session.user.id } },
      include: { listing: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch {
    dbUnavailable = true;
  }

  const rows: InquiryListRow[] = raw.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    fromName: r.fromName,
    fromEmail: r.fromEmail,
    message: r.message,
    listing: r.listing,
  }));

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">{t("subtitle")}</p>
      {dbUnavailable ? (
        <p
          role="alert"
          className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100"
        >
          Datenbank momentan nicht erreichbar. Bitte später erneut versuchen.
        </p>
      ) : (
        <div className="mt-10">
          <InquiryList rows={rows} />
        </div>
      )}
    </main>
  );
}
