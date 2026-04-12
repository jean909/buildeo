/**
 * Optional owner notification via Resend (https://resend.com).
 * No npm package — uses fetch. If RESEND_API_KEY is unset, this is a no-op.
 */

type NotifyParams = {
  ownerEmail: string;
  listingTitle: string;
  listingSlug: string;
  fromName: string;
  fromEmail: string;
  message: string;
};

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export async function notifyOwnerContactInquiry(params: NotifyParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return;

  const from = process.env.RESEND_FROM_EMAIL?.trim() || "Buildeo <onboarding@resend.dev>";
  const base = siteBase();
  const inquiriesUrl = `${base}/anfragen`;
  const listingUrl = `${base}/inserat/${encodeURIComponent(params.listingSlug)}`;

  const text = [
    `Neue Kontaktanfrage zu deinem Inserat „${params.listingTitle}“.`,
    "",
    `Absender: ${params.fromName}`,
    `E-Mail: ${params.fromEmail}`,
    "",
    "Nachricht:",
    params.message,
    "",
    `Inserat: ${listingUrl}`,
    `Alle Anfragen: ${inquiriesUrl}`,
    "",
    "Du kannst direkt auf diese E-Mail antworten (Reply) — die Antwort geht an den Interessenten, sofern dein Mail-Client Reply-To unterstützt.",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.ownerEmail],
      reply_to: params.fromEmail,
      subject: `Buildeo: Anfrage zu „${params.listingTitle.slice(0, 60)}${params.listingTitle.length > 60 ? "…" : ""}“`,
      text,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[resend] contact notify failed", res.status, errText);
  }
}
