/**
 * Minimal Replicate prediction runner (polling). Set REPLICATE_API_TOKEN + REPLICATE_FLIPO_VERSION.
 * Version = model version hash from replicate.com (not owner/name).
 */

const API = "https://api.replicate.com/v1";

type PredictionResponse = {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: unknown;
  error?: string;
  urls?: { get: string };
};

export async function runReplicateTextCompletion(prompt: string): Promise<string> {
  const token = process.env.REPLICATE_API_TOKEN?.trim();
  const version = process.env.REPLICATE_FLIPO_VERSION?.trim();
  if (!token || !version) {
    throw new Error("MISSING_REPLICATE_CONFIG");
  }

  const input: Record<string, unknown> = { prompt };
  const extra = process.env.REPLICATE_FLIPO_INPUT_JSON?.trim();
  if (extra) {
    try {
      Object.assign(input, JSON.parse(extra) as Record<string, unknown>);
    } catch {
      /* ignore invalid JSON */
    }
  }

  const createRes = await fetch(`${API}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version,
      input,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`REPLICATE_CREATE_${createRes.status}: ${err.slice(0, 200)}`);
  }

  const created = (await createRes.json()) as PredictionResponse;
  const getUrl = created.urls?.get;
  if (!getUrl) throw new Error("REPLICATE_NO_POLL_URL");

  const deadline = Date.now() + 90_000;
  let pred = created;

  while (pred.status === "starting" || pred.status === "processing") {
    if (Date.now() > deadline) throw new Error("REPLICATE_TIMEOUT");
    await new Promise((r) => setTimeout(r, 1200));
    const poll = await fetch(getUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!poll.ok) throw new Error(`REPLICATE_POLL_${poll.status}`);
    pred = (await poll.json()) as PredictionResponse;
  }

  if (pred.status !== "succeeded") {
    throw new Error(pred.error || `REPLICATE_${pred.status}`);
  }

  return normalizeOutput(pred.output);
}

function normalizeOutput(output: unknown): string {
  if (output == null) return "";
  if (typeof output === "string") return output;
  if (Array.isArray(output)) {
    return output.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join("");
  }
  if (typeof output === "object" && output !== null && "text" in output) {
    const t = (output as { text?: unknown }).text;
    return typeof t === "string" ? t : "";
  }
  return JSON.stringify(output);
}
