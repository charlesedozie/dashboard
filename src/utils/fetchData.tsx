export async function fetchData<T>(
  apiUrl: string,
  options?: RequestInit,
  limit: number = 100 // ✅ Optional parameter with default value
): Promise<T | null> {
  try {
    const token = sessionStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Add limit query parameter if not already present
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE}/${apiUrl}`);
    if (!url.searchParams.has("limit")) {
     // url.searchParams.append("limit", String(limit));
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
      cache: "no-store", // ensures fresh data every time
      ...options, // ✅ allows overriding fetch options
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data as T; // Caller ensures type match
  } catch (error) {
    console.error("Error fetching data at fetchData:", error);
    return null;
  }
}
