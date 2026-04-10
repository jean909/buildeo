export const COOKIE_CONSENT_STORAGE_KEY = "buildeo-cookie-consent";
export const COOKIE_CONSENT_VERSION = 1 as const;

export type StoredCookieConsent = {
  version: typeof COOKIE_CONSENT_VERSION;
  analytics: boolean;
  marketing: boolean;
};

export const OPEN_COOKIE_SETTINGS_EVENT = "buildeo-open-cookie-settings";
