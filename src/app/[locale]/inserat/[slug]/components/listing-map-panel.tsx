"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

function ListingMapLoading() {
  const t = useTranslations("listing");
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{t("mapLoading")}</span>
    </div>
  );
}

const ListingDetailMapClient = dynamic(
  () =>
    import("@/components/maps/listing-detail-map-client").then((m) => m.ListingDetailMapClient),
  { ssr: false, loading: () => <ListingMapLoading /> },
);

type Props = {
  lat: number;
  lng: number;
  title: string;
  accessToken: string;
};

export function ListingMapPanel({ lat, lng, title, accessToken }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-[var(--shadow-bd-card)] dark:border-zinc-700">
      <ListingDetailMapClient lat={lat} lng={lng} title={title} accessToken={accessToken} />
    </div>
  );
}
