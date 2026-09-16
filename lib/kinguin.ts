// Kinguin dev-portal / ESA Integration API client.
// Docs: https://www.kinguin.net/dev-portal
//
// Auth: prefers a direct X-Api-Key (KINGUIN_API_KEY). If only OAuth2 client
// credentials are configured, it exchanges them for a bearer token and caches
// it until expiry. Every call normalises Kinguin's product shape into our own
// `KinguinProduct` so the UI never touches raw API fields.

const API_BASE = process.env.KINGUIN_API_BASE ?? "https://gateway.kinguin.net/esa/api/v1";
const TOKEN_URL = process.env.KINGUIN_OAUTH_TOKEN_URL ?? "https://gateway.kinguin.net/oauth/token";
const API_KEY = process.env.KINGUIN_API_KEY ?? "";
const CLIENT_ID = process.env.KINGUIN_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.KINGUIN_CLIENT_SECRET ?? "";

export interface KinguinProduct {
  id: string;
  slug: string;
  name: string;
  platform: string;
  region: string;
  genres: string[];
  priceEur: number; // cheapest offer, in EUR
  qty: number; // in-stock count
  coverImage: string | null;
  screenshots: string[];
  description: string;
  releaseDate: string | null;
  developers: string[];
  publishers: string[];
  activationDetails: string;
  systemRequirements: string;
}

export interface ProductPage {
  items: KinguinProduct[];
  total: number;
  page: number;
  totalPages: number;
}

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getBearerToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET) return null;
  if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) return tokenCache.token;

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Kinguin OAuth failed: ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in?: number };
  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
  };
  return tokenCache.token;
}

async function authHeaders(): Promise<Record<string, string>> {
  if (API_KEY) return { "X-Api-Key": API_KEY };
  const token = await getBearerToken();
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(await authHeaders()),
    ...(init?.headers ?? {}),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    // Kinguin catalog is stable for minutes; cache to spare rate limits.
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Kinguin API ${res.status} on ${path}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

// First non-empty URL string from the candidates (empty strings are common in
// Kinguin's payload, so `??` alone would latch onto a "" and blur the image).
function firstUrl(...vals: unknown[]): string | null {
  for (const v of vals) if (typeof v === "string" && v.trim() !== "") return v;
  return null;
}

function slugify(name: string, id: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) + `-${id}`
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalise(raw: any): KinguinProduct {
  // kinguinId is the routable id: GET /products/{kinguinId} and the order
  // payload both key off it, so make it our canonical id and slug suffix.
  const id = String(raw.kinguinId ?? raw.productId ?? raw.id ?? "");
  const name = String(raw.name ?? raw.originalName ?? "Unknown title");
  const images = raw.images ?? {};
  const screenshots: string[] = Array.isArray(images.screenshots)
    ? images.screenshots.map((s: any) => firstUrl(s?.url, s?.thumbnail)).filter(Boolean)
    : [];
  // Prefer the high-res cover, then a sharp 1024px screenshot. The tiny cover
  // thumbnail is a last resort so cards never upscale a blurry image.
  const cover = firstUrl(images.cover?.url, screenshots[0], images.cover?.thumbnail, raw.coverImage, raw.image);
  return {
    id,
    slug: slugify(name, id),
    name,
    platform: String(raw.platform ?? "Steam"),
    region: String(raw.regionalLimitations ?? raw.region ?? "Global"),
    genres: Array.isArray(raw.genres) ? raw.genres.map(String) : [],
    priceEur: Number(raw.cheapestOfferId ? raw.price : raw.price ?? 0) || 0,
    qty: Number(raw.qty ?? raw.offersCount ?? 0) || 0,
    coverImage: cover,
    screenshots,
    description: String(raw.description ?? ""),
    releaseDate: raw.releaseDate ?? null,
    developers: Array.isArray(raw.developers) ? raw.developers.map(String) : [],
    publishers: Array.isArray(raw.publishers) ? raw.publishers.map(String) : [],
    activationDetails: String(raw.activationDetails ?? ""),
    systemRequirements: String(raw.systemRequirements ?? ""),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface ListParams {
  page?: number;
  limit?: number;
  name?: string;
  platform?: string;
  genre?: string;
  sortBy?: string;
  sortType?: "asc" | "desc";
}

export async function listProducts(params: ListParams = {}): Promise<ProductPage> {
  const qs = new URLSearchParams();
  qs.set("page", String(params.page ?? 1));
  qs.set("limit", String(params.limit ?? 24));
  if (params.name) qs.set("name", params.name);
  if (params.platform) qs.set("platform", params.platform);
  if (params.genre) qs.set("genre", params.genre);
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortType) qs.set("sortType", params.sortType);

  const data = await api<{ results?: unknown[]; item_count?: number }>(`/products?${qs}`);
  const items = (data.results ?? []).map(normalise);
  const total = data.item_count ?? items.length;
  const limit = params.limit ?? 24;
  return {
    items,
    total,
    page: params.page ?? 1,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getProduct(id: string): Promise<KinguinProduct | null> {
  try {
    const raw = await api<unknown>(`/products/${id}`);
    return normalise(raw);
  } catch {
    return null;
  }
}

// Places an order on Kinguin and returns the issued keys. Requires a funded
// Kinguin balance and a live API key with the "order" scope.
export async function orderKeys(
  productId: string,
  qty: number,
  priceEur: number,
): Promise<{ orderId: string; keys: string[] }> {
  // ESA v1 flow: create order → dispatch it → pull the issued serials.
  const order = await api<{ orderId: string }>(`/order`, {
    method: "POST",
    body: JSON.stringify({ products: [{ kinguinId: productId, qty, price: priceEur }] }),
  });
  await api<unknown>(`/order/${order.orderId}/dispatch`, { method: "POST" }).catch(() => null);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const dispatched = await api<any>(`/order/${order.orderId}/keys`);
  const rows: any[] = Array.isArray(dispatched)
    ? dispatched
    : Array.isArray(dispatched?.keys)
      ? dispatched.keys
      : [];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return {
    orderId: order.orderId,
    keys: rows.map((k) => String(k.serial ?? k.key ?? k)).filter(Boolean),
  };
}

export function isKinguinConfigured(): boolean {
  return Boolean(API_KEY || (CLIENT_ID && CLIENT_SECRET));
}
