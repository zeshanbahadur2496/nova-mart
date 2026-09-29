export type MarketCode = "IN" | "US" | "GB" | "DE" | "AE" | "CA" | "AU" | "SG";

export type Market = {
  code: MarketCode;
  name: string;
  flag: string;
  locale: string;
  currency: string;
  currencyLabel: string;
  /** Multiply INR base price by this rate to get local currency amount */
  exchangeRate: number;
  domainSuffix: string;
  postal: {
    label: string;
    placeholder: string;
    maxLength: number;
    pattern: RegExp;
    errorMessage: string;
  };
  tax: { rate: number; label: string };
  shipping: { freeThreshold: number; flatRate: number; expressFee: number };
  stripeCurrency: string;
  defaultLocation: { postalCode: string; city: string };
  locations: { postalCode: string; city: string }[];
  phonePlaceholder: string;
  seller: string;
};

export const MARKETS: Record<MarketCode, Market> = {
  IN: {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    locale: "en-IN",
    currency: "INR",
    currencyLabel: "INR – Indian Rupee",
    exchangeRate: 1,
    domainSuffix: ".in",
    postal: {
      label: "Pincode",
      placeholder: "Enter pincode",
      maxLength: 6,
      pattern: /^\d{6}$/,
      errorMessage: "Enter a valid 6-digit pincode"
    },
    tax: { rate: 0.18, label: "GST (18%)" },
    shipping: { freeThreshold: 499, flatRate: 40, expressFee: 99 },
    stripeCurrency: "inr",
    defaultLocation: { postalCode: "110001", city: "New Delhi" },
    locations: [
      { postalCode: "110001", city: "New Delhi" },
      { postalCode: "400001", city: "Mumbai" },
      { postalCode: "560001", city: "Bengaluru" },
      { postalCode: "600001", city: "Chennai" }
    ],
    phonePlaceholder: "+91 98765 43210",
    seller: "Amazon Fulfilment India"
  },
  US: {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    locale: "en-US",
    currency: "USD",
    currencyLabel: "USD – US Dollar",
    exchangeRate: 0.012,
    domainSuffix: ".com",
    postal: {
      label: "ZIP code",
      placeholder: "Enter ZIP code",
      maxLength: 10,
      pattern: /^\d{5}(-\d{4})?$/,
      errorMessage: "Enter a valid 5-digit ZIP code"
    },
    tax: { rate: 0.08, label: "Sales tax (8%)" },
    shipping: { freeThreshold: 35, flatRate: 5.99, expressFee: 12.99 },
    stripeCurrency: "usd",
    defaultLocation: { postalCode: "10001", city: "New York" },
    locations: [
      { postalCode: "10001", city: "New York" },
      { postalCode: "90210", city: "Los Angeles" },
      { postalCode: "60601", city: "Chicago" },
      { postalCode: "94102", city: "San Francisco" }
    ],
    phonePlaceholder: "+1 (555) 123-4567",
    seller: "Amazon.com Services LLC"
  },
  GB: {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    locale: "en-GB",
    currency: "GBP",
    currencyLabel: "GBP – British Pound",
    exchangeRate: 0.0095,
    domainSuffix: ".co.uk",
    postal: {
      label: "Postcode",
      placeholder: "Enter postcode",
      maxLength: 8,
      pattern: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
      errorMessage: "Enter a valid UK postcode"
    },
    tax: { rate: 0.2, label: "VAT (20%)" },
    shipping: { freeThreshold: 25, flatRate: 3.99, expressFee: 9.99 },
    stripeCurrency: "gbp",
    defaultLocation: { postalCode: "SW1A 1AA", city: "London" },
    locations: [
      { postalCode: "SW1A 1AA", city: "London" },
      { postalCode: "M1 1AE", city: "Manchester" },
      { postalCode: "B1 1BB", city: "Birmingham" },
      { postalCode: "EH1 1YZ", city: "Edinburgh" }
    ],
    phonePlaceholder: "+44 7700 900123",
    seller: "Amazon UK Services Ltd"
  },
  DE: {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    locale: "de-DE",
    currency: "EUR",
    currencyLabel: "EUR – Euro",
    exchangeRate: 0.011,
    domainSuffix: ".de",
    postal: {
      label: "Postleitzahl",
      placeholder: "PLZ eingeben",
      maxLength: 5,
      pattern: /^\d{5}$/,
      errorMessage: "Enter a valid 5-digit postcode"
    },
    tax: { rate: 0.19, label: "MwSt (19%)" },
    shipping: { freeThreshold: 29, flatRate: 4.99, expressFee: 9.99 },
    stripeCurrency: "eur",
    defaultLocation: { postalCode: "10115", city: "Berlin" },
    locations: [
      { postalCode: "10115", city: "Berlin" },
      { postalCode: "80331", city: "Munich" },
      { postalCode: "20095", city: "Hamburg" },
      { postalCode: "60311", city: "Frankfurt" }
    ],
    phonePlaceholder: "+49 151 12345678",
    seller: "Amazon EU S.à r.l."
  },
  AE: {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    locale: "en-AE",
    currency: "AED",
    currencyLabel: "AED – UAE Dirham",
    exchangeRate: 0.044,
    domainSuffix: ".ae",
    postal: {
      label: "Area code",
      placeholder: "Enter area code",
      maxLength: 5,
      pattern: /^\d{3,5}$/,
      errorMessage: "Enter a valid area code"
    },
    tax: { rate: 0.05, label: "VAT (5%)" },
    shipping: { freeThreshold: 100, flatRate: 15, expressFee: 35 },
    stripeCurrency: "aed",
    defaultLocation: { postalCode: "00000", city: "Dubai" },
    locations: [
      { postalCode: "00000", city: "Dubai" },
      { postalCode: "00000", city: "Abu Dhabi" },
      { postalCode: "00000", city: "Sharjah" }
    ],
    phonePlaceholder: "+971 50 123 4567",
    seller: "Amazon.ae FZ LLC"
  },
  CA: {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    locale: "en-CA",
    currency: "CAD",
    currencyLabel: "CAD – Canadian Dollar",
    exchangeRate: 0.016,
    domainSuffix: ".ca",
    postal: {
      label: "Postal code",
      placeholder: "Enter postal code",
      maxLength: 7,
      pattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
      errorMessage: "Enter a valid Canadian postal code"
    },
    tax: { rate: 0.13, label: "Tax (13%)" },
    shipping: { freeThreshold: 35, flatRate: 6.99, expressFee: 14.99 },
    stripeCurrency: "cad",
    defaultLocation: { postalCode: "M5H 2N2", city: "Toronto" },
    locations: [
      { postalCode: "M5H 2N2", city: "Toronto" },
      { postalCode: "V6B 1A1", city: "Vancouver" },
      { postalCode: "H2Y 1C6", city: "Montreal" },
      { postalCode: "T2P 1J9", city: "Calgary" }
    ],
    phonePlaceholder: "+1 (416) 555-0123",
    seller: "Amazon Canada Fulfillment Services"
  },
  AU: {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    locale: "en-AU",
    currency: "AUD",
    currencyLabel: "AUD – Australian Dollar",
    exchangeRate: 0.018,
    domainSuffix: ".com.au",
    postal: {
      label: "Postcode",
      placeholder: "Enter postcode",
      maxLength: 4,
      pattern: /^\d{4}$/,
      errorMessage: "Enter a valid 4-digit postcode"
    },
    tax: { rate: 0.1, label: "GST (10%)" },
    shipping: { freeThreshold: 49, flatRate: 7.99, expressFee: 15.99 },
    stripeCurrency: "aud",
    defaultLocation: { postalCode: "2000", city: "Sydney" },
    locations: [
      { postalCode: "2000", city: "Sydney" },
      { postalCode: "3000", city: "Melbourne" },
      { postalCode: "4000", city: "Brisbane" },
      { postalCode: "6000", city: "Perth" }
    ],
    phonePlaceholder: "+61 412 345 678",
    seller: "Amazon Commercial Services Pty Ltd"
  },
  SG: {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    locale: "en-SG",
    currency: "SGD",
    currencyLabel: "SGD – Singapore Dollar",
    exchangeRate: 0.016,
    domainSuffix: ".sg",
    postal: {
      label: "Postal code",
      placeholder: "Enter postal code",
      maxLength: 6,
      pattern: /^\d{6}$/,
      errorMessage: "Enter a valid 6-digit postal code"
    },
    tax: { rate: 0.09, label: "GST (9%)" },
    shipping: { freeThreshold: 40, flatRate: 4.99, expressFee: 9.99 },
    stripeCurrency: "sgd",
    defaultLocation: { postalCode: "018956", city: "Singapore" },
    locations: [
      { postalCode: "018956", city: "Marina Bay" },
      { postalCode: "238859", city: "Orchard" },
      { postalCode: "609601", city: "Jurong" }
    ],
    phonePlaceholder: "+65 9123 4567",
    seller: "Amazon Asia-Pacific Holdings"
  }
};

export const MARKET_CODES = Object.keys(MARKETS) as MarketCode[];
export const DEFAULT_MARKET: MarketCode = "US";
export const MARKET_COOKIE = "amazon-market";

const COUNTRY_TO_MARKET: Record<string, MarketCode> = {
  IN: "IN",
  US: "US",
  GB: "GB",
  UK: "GB",
  DE: "DE",
  AE: "AE",
  CA: "CA",
  AU: "AU",
  SG: "SG"
};

const TIMEZONE_TO_MARKET: Record<string, MarketCode> = {
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "Europe/London": "GB",
  "Europe/Berlin": "DE",
  "Asia/Dubai": "AE",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Asia/Singapore": "SG"
};

export function getMarket(code?: string | null): Market {
  const key = (code?.toUpperCase() as MarketCode) ?? DEFAULT_MARKET;
  return MARKETS[key in MARKETS ? key : DEFAULT_MARKET];
}

export function isValidMarket(code: string): code is MarketCode {
  return code in MARKETS;
}

export function countryToMarket(country?: string | null): MarketCode {
  if (!country) return DEFAULT_MARKET;
  return COUNTRY_TO_MARKET[country.toUpperCase()] ?? DEFAULT_MARKET;
}

export function timezoneToMarket(timezone?: string | null): MarketCode {
  if (!timezone) return DEFAULT_MARKET;
  return TIMEZONE_TO_MARKET[timezone] ?? DEFAULT_MARKET;
}

export function detectMarketFromAcceptLanguage(header?: string | null): MarketCode {
  if (!header) return DEFAULT_MARKET;
  const lower = header.toLowerCase();
  if (lower.includes("en-in") || lower.includes("hi")) return "IN";
  if (lower.includes("en-gb")) return "GB";
  if (lower.includes("de")) return "DE";
  if (lower.includes("en-au")) return "AU";
  if (lower.includes("en-ca") || lower.includes("fr-ca")) return "CA";
  if (lower.includes("en-sg")) return "SG";
  if (lower.includes("en-us")) return "US";
  return DEFAULT_MARKET;
}
