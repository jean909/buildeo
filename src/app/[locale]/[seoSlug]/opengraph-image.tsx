import { ImageResponse } from "next/og";
import { resolveSeoSlug } from "@/lib/seo";

export const alt = "Buildeo – Immobilien & Wohnungen in Deutschland";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string; seoSlug: string }>;
};

export default async function Image({ params }: Props) {
  const { seoSlug } = await params;
  const page = resolveSeoSlug(seoSlug);

  if (!page) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            backgroundColor: "#09090b",
            color: "#ffffff",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          Buildeo · Immobilien in Deutschland
        </div>
      ),
      size,
    );
  }

  const rentStr = `${page.effectiveRentPerM2.toFixed(2).replace(".", ",")} €/m²`;
  const buyStr = `${page.effectiveBuyPerM2.toLocaleString("de-DE")} €/m²`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px",
          background: "linear-gradient(135deg, #09090b 0%, #111827 55%, #042f2e 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "#14b8a6",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: 800,
                color: "#042f2e",
              }}
            >
              B
            </div>
            <span style={{ fontSize: "30px", fontWeight: 700, letterSpacing: "-0.02em" }}>
              buildeo.de
            </span>
          </div>

          <div
            style={{
              display: "flex",
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(20, 184, 166, 0.16)",
              border: "1px solid rgba(20, 184, 166, 0.4)",
              color: "#5eead4",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            {page.city.bundesland} · PLZ {page.district?.postalCode ?? page.city.postalCodes}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#5eead4",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {page.intent.pluralLabel} · {page.city.districts.length} Stadtteile
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            {page.intent.label} in {page.locationName}
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#a1a1aa",
              maxWidth: "960px",
              lineHeight: 1.35,
            }}
          >
            Aktuelle Angebote, Stadtteil-Vergleich, historische Architektur & Marktpreise in{" "}
            {page.locationFullLabel}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "18px 28px",
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <span style={{ fontSize: "16px", color: "#a1a1aa" }}>Ø Kaltmiete</span>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#5eead4" }}>
              {rentStr}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "18px 28px",
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <span style={{ fontSize: "16px", color: "#a1a1aa" }}>Ø Kaufpreis</span>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff" }}>
              {buyStr}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "18px 28px",
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <span style={{ fontSize: "16px", color: "#a1a1aa" }}>Einwohner ({page.city.name})</span>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff" }}>
              ~{page.city.population.toLocaleString("de-DE")}
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
