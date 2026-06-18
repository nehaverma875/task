export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", headers.get("Content-Type") || "application/json");

  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("ops-admin-token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...init,
    headers
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
