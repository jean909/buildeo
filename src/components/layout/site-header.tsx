import { getTranslations } from "next-intl/server";
import { SiteHeaderClient } from "@/components/layout/site-header-client";

export async function SiteHeader() {
  const t = await getTranslations("nav");

  return (
    <SiteHeaderClient
      labels={{
        search: t("search"),
        listProperty: t("listProperty"),
      }}
    />
  );
}
