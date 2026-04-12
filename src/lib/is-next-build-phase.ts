/**
 * Vercel build workers often cannot reach Supabase :5432; skip optional DB reads then.
 * Runtime on Vercel still has VERCEL=1 but NEXT_PHASE is not the build phase → DB runs.
 */
export function shouldSkipOptionalDbReadsDuringPrerender(): boolean {
  return Boolean(process.env.VERCEL) && process.env.NEXT_PHASE === "phase-production-build";
}
