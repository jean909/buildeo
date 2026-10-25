import type { SeoCity } from "./types";
import { CITIES_NORTH } from "./data/cities-north";
import { CITIES_WEST } from "./data/cities-west";
import { CITIES_EAST } from "./data/cities-east";
import { CITIES_SOUTH } from "./data/cities-south";

export const ALL_SEO_CITIES: SeoCity[] = [
  ...CITIES_NORTH,
  ...CITIES_WEST,
  ...CITIES_EAST,
  ...CITIES_SOUTH,
];

/** Map of city slug -> SeoCity for O(1) lookup */
export const CITY_BY_SLUG = new Map<string, SeoCity>(
  ALL_SEO_CITIES.map((city) => [city.slug, city]),
);

/** Short alias slugs for cities with multi-word names (e.g. "frankfurt" -> "frankfurt-am-main") */
export const CITY_SLUG_ALIASES: Record<string, string> = {
  frankfurt: "frankfurt-am-main",
  offenbach: "offenbach-am-main",
  freiburg: "freiburg-im-breisgau",
  esslingen: "esslingen-am-neckar",
  halle: "halle-saale",
  ludwigshafen: "ludwigshafen-am-rhein",
  muelheim: "muelheim-an-der-ruhr",
  brandenburg: "brandenburg-an-der-havel",
  dessau: "dessau-rosslau",
  lingen: "lingen-ems",
};

/** Group cities by Bundesland for directory & internal linking */
export function getCitiesByBundesland(): Record<string, SeoCity[]> {
  const grouped: Record<string, SeoCity[]> = {};
  for (const city of ALL_SEO_CITIES) {
    if (!grouped[city.bundesland]) {
      grouped[city.bundesland] = [];
    }
    grouped[city.bundesland].push(city);
  }
  return grouped;
}
