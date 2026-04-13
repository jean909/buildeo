import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";
import { auth } from "@/auth";
import { getListingBySlug, getListingDetailBySlug } from "@/lib/listings-repo";
import { notFound } from "next/navigation";
import { ListingContactRoot, type ContactFormLabels } from "./components/listing-contact-root";
import { ListingMobileBar } from "./components/listing-mobile-bar";
import { ListingShareButton } from "./components/listing-share-button";
import { ListingStickyAside } from "./components/listing-sticky-aside";
import { ListingMapPanel } from "./components/listing-map-panel";
import { ListingCoverMedia } from "@/components/listing/listing-cover-media";
import { MapPlaceholder } from "@/components/search/map-placeholder";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/** Vercel build cannot reach Supabase direct DB; avoid Prisma at build time. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  let listing: Awaited<ReturnType<typeof getListingBySlug>>;
  try {
    listing = await getListingBySlug(slug);
  } catch {
    return { title: "Buildeo" };
  }
  if (!listing) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "listing" });
  const isRent = listing.kind === "rent";
  const priceLabel = isRent ? t("rent") : t("price");
  const teaser =
    listing.description.length > 155
      ? `${listing.description.slice(0, 152)}…`
      : listing.description;

  return {
    title: `${listing.title} – ${listing.city}`,
    description: `${priceLabel}: ${listing.priceEur.toLocaleString("de-DE")} EUR · ${teaser}`,
    openGraph: {
      title: listing.title,
      description: teaser,
      ...(listing.coverImageUrl
        ? {
            images: [
              {
                url: listing.coverImageUrl,
                width: 1200,
                height: 630,
                alt: listing.title,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let detail: Awaited<ReturnType<typeof getListingDetailBySlug>>;
  try {
    detail = await getListingDetailBySlug(slug);
  } catch {
    return (
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-24 text-center">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Inserat-Datenbank momentan nicht erreichbar. Bitte später erneut versuchen.
        </p>
      </main>
    );
  }
  if (!detail) {
    notFound();
  }

  const { listing, ownerId } = detail;
  const session = await auth();
  const isOwner = Boolean(session?.user?.id && ownerId && session.user.id === ownerId);
  const contactEnabled = Boolean(ownerId) && !isOwner;

  const t = await getTranslations("listing");
  const tSearch = await getTranslations("search");
  const tCrumb = await getTranslations("breadcrumbs");
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? null;
  const hasMapCoords = listing.lat != null && listing.lng != null;
  const isRent = listing.kind === "rent";
  const priceLabel = isRent ? t("rent") : t("price");
  const formatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(listing.priceEur);

  const contactLabels: ContactFormLabels = {
    title: t("contactForm.title"),
    name: t("contactForm.name"),
    email: t("contactForm.email"),
    message: t("contactForm.message"),
    submit: t("contactForm.submit"),
    close: t("contactForm.close"),
    success: t("contactForm.success"),
    hint: t("contactForm.hint"),
    sending: t("contactForm.sending"),
    errorGeneric: t("contactForm.errorGeneric"),
    errorNoOwner: t("contactForm.errorNoOwner"),
    errorOwnListing: t("contactForm.errorOwnListing"),
    backToSearch: t("contactForm.backToSearch"),
  };

  return (
    <ListingContactRoot
      listingSlug={listing.slug}
      listingTitle={listing.title}
      labels={contactLabels}
      contactEnabled={contactEnabled}
    >
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-8 sm:px-6 sm:pb-10 lg:pb-12">
        <PageBreadcrumbs
          items={[
            { href: "/", label: tCrumb("home") },
            { href: "/suche", label: tCrumb("search") },
            { label: listing.title },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-12">
          <article>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-bd-primary dark:text-teal-300">
                  {listing.postalCode} {listing.city}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                  {listing.title}
                </h1>
              </div>
              <ListingShareButton />
            </div>

            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 shadow-[var(--shadow-bd-card)] dark:from-zinc-800 dark:to-zinc-900">
              {listing.coverImageUrl ? (
                <ListingCoverMedia
                  src={listing.coverImageUrl}
                  alt={listing.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                />
              ) : null}
            </div>

            <section className="mt-10" aria-labelledby="facts-heading">
              <h2 id="facts-heading" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {t("sectionFacts")}
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <dt className="text-zinc-500 dark:text-zinc-400">{t("rooms")}</dt>
                  <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
                    {listing.rooms} {t("roomsShort")}
                  </dd>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <dt className="text-zinc-500 dark:text-zinc-400">{t("livingArea")}</dt>
                  <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
                    {listing.livingAreaM2} m²
                  </dd>
                </div>
                <div className="col-span-2 rounded-lg border border-zinc-200 bg-white p-4 sm:col-span-1 dark:border-zinc-800 dark:bg-zinc-900">
                  <dt className="text-zinc-500 dark:text-zinc-400">{priceLabel}</dt>
                  <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">{formatted}</dd>
                </div>
              </dl>
            </section>

            {hasMapCoords ? (
              <section className="mt-10" aria-labelledby="location-heading">
                <h2
                  id="location-heading"
                  className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
                >
                  {t("sectionLocation")}
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {listing.postalCode} {listing.city}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{t("mapApproximate")}</p>
                <div className="mt-4">
                  {mapboxToken ? (
                    <ListingMapPanel
                      lat={listing.lat as number}
                      lng={listing.lng as number}
                      title={listing.title}
                      accessToken={mapboxToken}
                    />
                  ) : (
                    <MapPlaceholder variant="compact" />
                  )}
                </div>
                {!mapboxToken ? (
                  <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-500">
                    {tSearch("map.tokenHint")}
                  </p>
                ) : null}
              </section>
            ) : null}

            <section className="mt-10" aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {t("sectionAbout")}
              </h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-zinc-700 dark:text-zinc-300">
                {listing.description}
              </p>
            </section>
          </article>

          <div className="hidden lg:block">
            <div className="sticky top-20">
              <ListingStickyAside listing={listing} contactEnabled={contactEnabled} isOwner={isOwner} />
            </div>
          </div>
        </div>
      </main>

      <ListingMobileBar
        priceLabel={priceLabel}
        formatted={formatted}
        contactLabel={t("contact")}
        ownerInquiriesLabel={t("ownerInquiriesShort")}
        isOwner={isOwner}
      />
    </ListingContactRoot>
  );
}
