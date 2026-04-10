import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Unsplash — Demo-Cover (free use). */
const listings = [
  {
    slug: "berlin-kreuzberg-3-zimmer-altbau",
    title: "Altbau mit Balkon, ruhige Seitenstraße",
    city: "Berlin",
    postalCode: "10999",
    kind: "rent",
    rooms: 3,
    livingAreaM2: 78,
    priceEur: 1240,
    description:
      "Hell, zwei Schlafzimmer, EBK möglich. Nah zu U-Bhf. Görlitzer Bahnhof.",
    isNew: false,
    lat: 52.499,
    lng: 13.438,
    coverImageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "muenchen-sendling-einfamilienhaus",
    title: "EFH mit Garten, saniert 2023",
    city: "München",
    postalCode: "81369",
    kind: "buy",
    rooms: 5,
    livingAreaM2: 142,
    priceEur: 875000,
    description:
      "Südwest-Ausrichtung, Carport, unterkellerter Wohnbereich. Energieausweis liegt vor.",
    isNew: false,
    lat: 48.115,
    lng: 11.535,
    coverImageUrl:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "hamburg-eimsbuettel-2-zimmer-neubau",
    title: "Neubau-Erstbezug, Fußbodenheizung",
    city: "Hamburg",
    postalCode: "20259",
    kind: "rent",
    rooms: 2,
    livingAreaM2: 56,
    priceEur: 980,
    description: "Südbalkon, Tiefgaragenstellplatz optional. Nähe Uni und S-Bahn.",
    isNew: true,
    lat: 53.565,
    lng: 9.958,
    coverImageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "frankfurt-sachsenhausen-studio",
    title: "Citynahes Studio mit Loggia",
    city: "Frankfurt am Main",
    postalCode: "60594",
    kind: "rent",
    rooms: 1,
    livingAreaM2: 34,
    priceEur: 790,
    description: "Komplett renoviert 2024, Einbauküche, ruhig zum Innenhof.",
    isNew: true,
    lat: 50.105,
    lng: 8.682,
    coverImageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "koeln-ehrenfeld-loft",
    title: "Loft mit Galerie und Industriefenstern",
    city: "Köln",
    postalCode: "50825",
    kind: "buy",
    rooms: 2,
    livingAreaM2: 88,
    priceEur: 449000,
    description: "Gewerbefläche möglich, hohe Decken, Aufzug direkt in die Wohnung.",
    isNew: false,
    lat: 50.954,
    lng: 6.918,
    coverImageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("buildeo-demo", 12);
  await prisma.user.upsert({
    where: { email: "demo@buildeo.de" },
    update: { passwordHash, name: "Demo Nutzer" },
    create: {
      email: "demo@buildeo.de",
      name: "Demo Nutzer",
      passwordHash,
    },
  });

  for (const l of listings) {
    await prisma.listing.upsert({
      where: { slug: l.slug },
      update: {
        title: l.title,
        city: l.city,
        postalCode: l.postalCode,
        kind: l.kind,
        rooms: l.rooms,
        livingAreaM2: l.livingAreaM2,
        priceEur: l.priceEur,
        description: l.description,
        isNew: l.isNew,
        lat: l.lat,
        lng: l.lng,
        coverImageUrl: l.coverImageUrl,
      },
      create: {
        slug: l.slug,
        title: l.title,
        city: l.city,
        postalCode: l.postalCode,
        kind: l.kind,
        rooms: l.rooms,
        livingAreaM2: l.livingAreaM2,
        priceEur: l.priceEur,
        description: l.description,
        isNew: l.isNew,
        lat: l.lat,
        lng: l.lng,
        coverImageUrl: l.coverImageUrl,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
