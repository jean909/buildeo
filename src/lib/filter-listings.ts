export type SearchTyp = "mieten" | "kaufen" | undefined;

export const RENT_FEATURE_KEYS = ["balkon", "garten", "garage", "ebk", "keller", "aufzug"] as const;
export type RentFeatureKey = (typeof RENT_FEATURE_KEYS)[number];

export type SearchFilterState = {
  typ: SearchTyp;
  q: string;
  preisMin?: number;
  preisMax?: number;
  zimmerMin?: number;
  zimmerMax?: number;
  flaecheMin?: number;
  flaecheMax?: number;
  neinNeubau?: boolean;
  /** Nur Miete: nur Inserate mit isNew */
  nurNeu?: boolean;
  features: Partial<Record<RentFeatureKey, boolean>>;
};

export function parseTyp(v: string | string[] | undefined): SearchTyp {
  const raw = Array.isArray(v) ? v[0] : v;
  if (raw === "mieten") return "mieten";
  if (raw === "kaufen") return "kaufen";
  return undefined;
}

export function parsePositiveInt(v: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(v) ? v[0] : v;
  if (raw == null || raw === "") return undefined;
  const n = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}

export function parseBoolFlag(v: string | string[] | undefined): boolean | undefined {
  const raw = Array.isArray(v) ? v[0] : v;
  if (raw === "1" || raw === "true") return true;
  return undefined;
}

export function parseRentFeatures(sp: Record<string, string | string[] | undefined>): Partial<Record<RentFeatureKey, boolean>> {
  const features: Partial<Record<RentFeatureKey, boolean>> = {};
  for (const k of RENT_FEATURE_KEYS) {
    if (parseBoolFlag(sp[k])) features[k] = true;
  }
  return features;
}

export function parseSearchFilters(sp: Record<string, string | string[] | undefined>): SearchFilterState {
  return {
    typ: parseTyp(sp.typ),
    q: typeof sp.q === "string" ? sp.q : "",
    preisMin: parsePositiveInt(sp.preisMin),
    preisMax: parsePositiveInt(sp.preisMax),
    zimmerMin: parsePositiveInt(sp.zimmerMin),
    zimmerMax: parsePositiveInt(sp.zimmerMax),
    flaecheMin: parsePositiveInt(sp.flaecheMin),
    flaecheMax: parsePositiveInt(sp.flaecheMax),
    neinNeubau: parseBoolFlag(sp.neinNeubau),
    nurNeu: parseBoolFlag(sp.nurNeu),
    features: parseRentFeatures(sp),
  };
}

function mergeFilters(base: SearchFilterState, patch: Partial<SearchFilterState>): SearchFilterState {
  return {
    typ: "typ" in patch ? patch.typ : base.typ,
    q: "q" in patch ? patch.q! : base.q,
    preisMin: "preisMin" in patch ? patch.preisMin : base.preisMin,
    preisMax: "preisMax" in patch ? patch.preisMax : base.preisMax,
    zimmerMin: "zimmerMin" in patch ? patch.zimmerMin : base.zimmerMin,
    zimmerMax: "zimmerMax" in patch ? patch.zimmerMax : base.zimmerMax,
    flaecheMin: "flaecheMin" in patch ? patch.flaecheMin : base.flaecheMin,
    flaecheMax: "flaecheMax" in patch ? patch.flaecheMax : base.flaecheMax,
    neinNeubau: "neinNeubau" in patch ? patch.neinNeubau : base.neinNeubau,
    nurNeu: "nurNeu" in patch ? patch.nurNeu : base.nurNeu,
    features: "features" in patch ? patch.features! : base.features,
  };
}

export function buildSearchQuery(base: SearchFilterState, patch: Partial<SearchFilterState> = {}): string {
  const m = mergeFilters(base, patch);
  const p = new URLSearchParams();

  if (m.typ) p.set("typ", m.typ);
  if (m.q.trim()) p.set("q", m.q.trim());
  if (m.preisMin != null) p.set("preisMin", String(m.preisMin));
  if (m.preisMax != null) p.set("preisMax", String(m.preisMax));
  if (m.zimmerMin != null) p.set("zimmerMin", String(m.zimmerMin));
  if (m.zimmerMax != null) p.set("zimmerMax", String(m.zimmerMax));
  if (m.flaecheMin != null) p.set("flaecheMin", String(m.flaecheMin));
  if (m.flaecheMax != null) p.set("flaecheMax", String(m.flaecheMax));
  if (m.neinNeubau) p.set("neinNeubau", "1");
  if (m.nurNeu) p.set("nurNeu", "1");

  for (const k of RENT_FEATURE_KEYS) {
    if (m.features[k]) p.set(k, "1");
  }

  const s = p.toString();
  return s ? `?${s}` : "";
}

export function toggleRentFeature(base: SearchFilterState, key: RentFeatureKey): string {
  const next = { ...base.features };
  if (next[key]) delete next[key];
  else next[key] = true;
  return buildSearchQuery(base, { features: next });
}

export function toggleNeinNeubau(base: SearchFilterState): string {
  return buildSearchQuery(base, { neinNeubau: !base.neinNeubau });
}

/** Clear Miete-only URL params (e.g. when switching to Kaufen). */
export function clearRentOnlyParams(base: SearchFilterState): SearchFilterState {
  return {
    ...base,
    features: {},
    neinNeubau: undefined,
    nurNeu: undefined,
  };
}

export function toggleNurNeu(base: SearchFilterState): string {
  return buildSearchQuery(base, { nurNeu: !base.nurNeu });
}
