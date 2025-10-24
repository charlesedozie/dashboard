// utils/fetchSubjects.ts
export interface Subject {
  id: string;
  name: string;
  // Add other fields if API returns more data
}

export async function fetchSubjects(): Promise<Subject[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/subjects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
		"Authorization": `Bearer ${sessionStorage.getItem("token")}`, // Bearer Token
      },
      cache: "no-store", // ensures fresh data every time
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch subjects: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data as Subject[];
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
}
