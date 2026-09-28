// Auto-detects API base: checks VITE_API_BASE_URL, same origin in PROD, or localhost:8000 in dev
export const API_BASE =
    (import.meta.env.VITE_API_BASE_URL as string) ||
    (import.meta.env.PROD
        ? window.location.origin
        : "http://localhost:8000");

// Headers to bypass tunnel reminder interstitial pages (localtunnel, ngrok)
const TUNNEL_HEADERS = {
    "bypass-tunnel-reminder": "true",
    "ngrok-skip-browser-warning": "true",
};

export interface CategoryItem {
    name: string;
    path: string;
    section: string;
}

export interface GarmentsResponse {
    images: string[];
    filenames: string[];
}

export interface TryonResponse {
    results: (string | null)[];
    errors: number[];
}

export async function getGenders(): Promise<{ genders: string[] }> {
    const res = await fetch(`${API_BASE}/genders`, {
        headers: TUNNEL_HEADERS,
    });
    if (!res.ok) throw new Error("Failed to fetch genders");
    return res.json();
}

export async function getCategories(gender: string): Promise<{ categories: CategoryItem[] }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    try {
        const res = await fetch(`${API_BASE}/categories?gender=${encodeURIComponent(gender)}`, {
            headers: TUNNEL_HEADERS,
            signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to fetch categories for ${gender}`);
        return await res.json();
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function getGarments(gender: string, category: string): Promise<GarmentsResponse> {
    const res = await fetch(
        `${API_BASE}/garments?gender=${encodeURIComponent(gender)}&category=${encodeURIComponent(category)}`,
        {
            headers: TUNNEL_HEADERS,
        }
    );
    if (!res.ok) throw new Error(`Failed to fetch garments for ${gender}/${category}`);
    return res.json();
}

export async function generateTryons(
    gender: string,
    categoryPath: string,
    userFile: File
): Promise<TryonResponse> {
    const form = new FormData();
    form.append("gender", gender);
    form.append("category", categoryPath);
    form.append("user_photo", userFile);

    const res = await fetch(`${API_BASE}/generate-tryons`, {
        method: "POST",
        headers: TUNNEL_HEADERS,
        body: form,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error("Backend error: " + text);
    }

    return res.json();
}
