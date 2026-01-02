export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function apiJson<T>(
    path: string,
    options: RequestInit & { token?: string } = {},
): Promise<T> {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    if (options.token) headers.set("Authorization", `Bearer ${options.token}`);

    const res = await fetch(url, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
    }

    return (await res.json()) as T;
}
