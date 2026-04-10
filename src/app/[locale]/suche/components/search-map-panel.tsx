"use client";

import dynamic from "next/dynamic";
import { MapPlaceholder } from "@/components/search/map-placeholder";
import type { MapPin } from "@/types/map-pin";
import { useTranslations } from "next-intl";

function MapLoadingFallback() {
  const t = useTranslations("search.map");
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
      <span className="text-sm text-zinc-500">{t("loading")}</span>
    </div>
  );
}

const SearchMapClient = dynamic(
  () => import("@/components/maps/search-map-client").then((m) => m.SearchMapClient),
  {
    ssr: false,
    loading: () => <MapLoadingFallback />,
  },
);

type Props = {
  pins: MapPin[];
  mapboxToken: string | null;
  variant: "compact" | "tall";
};

export function SearchMapPanel({ pins, mapboxToken, variant }: Props) {
  const t = useTranslations("search.map");

  const heightClass =
    variant === "compact" ? "min-h-[200px] max-h-[220px]" : "min-h-[320px] lg:min-h-0 lg:h-full";

  if (!mapboxToken || pins.length === 0) {
    return (
      <div className={`flex flex-col ${heightClass}`}>
        <div className="min-h-0 flex-1">
          <MapPlaceholder variant={variant} />
        </div>
        {!mapboxToken ? (
          <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-500">{t("tokenHint")}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 ${heightClass}`}>
      <SearchMapClient pins={pins} accessToken={mapboxToken} />
    </div>
  );
}
