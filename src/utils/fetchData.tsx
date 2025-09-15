export interface Subject {
  id: string;
  name: string;
  // Add other fields if API returns more data
}

export async function fetchData<T>(apiUrl: string): Promise<T | null> {
	//console.log(apiUrl);
  try {
    const token = sessionStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/${apiUrl}`, {
      method: "GET",
      headers,
      cache: "no-store", // ensures fresh data every time
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data as T; // Cast to T (caller ensures match via type assertion if needed)
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Or re-throw: throw error;
  }
}