/** Internal redirect after login/register; only same-origin paths allowed. */
export function safeCallbackPathFromWindow(): string {
  if (typeof window === "undefined") return "/";
  const raw = new URLSearchParams(window.location.search).get("callbackUrl");
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}
