import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/** Verificare rapidă după deploy: Prisma + chei Supabase (fără date sensibile în răspuns). */
export async function GET() {
  const checks = { database: false, supabaseAnon: false, supabaseService: false };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch {
    /* conexiune DB indisponibilă */
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && anon) {
    try {
      const r = await fetch(`${url.replace(/\/$/, "")}/rest/v1/`, {
        headers: {
          apikey: anon,
          Authorization: `Bearer ${anon}`,
        },
        cache: "no-store",
      });
      checks.supabaseAnon = r.status !== 401 && r.status !== 403;
    } catch {
      /* rețea / URL invalid */
    }
  }

  if (url && service) {
    try {
      const admin = createSupabaseAdminClient();
      const { error } = await admin.from("Listing").select("id").limit(1).maybeSingle();
      checks.supabaseService = !error;
    } catch {
      /* chei lipsă sau client invalid */
    }
  }

  const ok = checks.database && checks.supabaseAnon && checks.supabaseService;
  return NextResponse.json({ ok, checks }, { status: ok ? 200 : 503 });
}
