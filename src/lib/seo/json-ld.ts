import type { Listing } from "@/types/listing";
import { buildSeoFaqItems } from "./engine";
import type { ResolvedSeoPage } from "./types";

export function buildSeoPageJsonLd(
  page: ResolvedSeoPage,
  listings: Listing[],
  siteBaseUrl: string,
) {
  const base = siteBaseUrl.replace(/\/$/, "");
  const pageUrl = `${base}/${page.fullSlug}`;
  const faqs = buildSeoFaqItems(page);

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Startseite",
      item: base,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Städte & Regionen",
      item: `${base}/staedte`,
    },
    ...(page.district
      ? [
          {
            "@type": "ListItem",
            position: 3,
            name: page.city.name,
            item: `${base}/${page.intent.prefix}-${page.city.slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: `${page.intent.label} ${page.locationName}`,
            item: pageUrl,
          },
        ]
      : [
          {
            "@type": "ListItem",
            position: 3,
            name: `${page.intent.label} ${page.city.name}`,
            item: pageUrl,
          },
        ]),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems,
      },
      {
        "@type": "Place",
        name: page.locationFullLabel,
        address: {
          "@type": "PostalAddress",
          addressLocality: page.city.name,
          addressRegion: page.city.bundesland,
          postalCode: page.district?.postalCode ?? page.city.postalCodes,
          addressCountry: "DE",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: page.city.lat,
          longitude: page.city.lng,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      ...(listings.length > 0
        ? [
            {
              "@type": "ItemList",
              name: `${page.intent.pluralLabel} in ${page.locationName}`,
              numberOfItems: listings.length,
              itemListElement: listings.slice(0, 10).map((l, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                url: `${base}/inserat/${l.slug}`,
                name: l.title,
              })),
            },
          ]
        : []),
    ],
  };
}
