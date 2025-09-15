import qs from 'qs';

export async function GetNav(apiUrl: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/navigations`);

    if (!res.ok) {
      // Log the response body for debugging
      const errorBody = await res.text();
      console.error("Fetch error response:", errorBody);
      throw new Error(`Failed to fetch bookmakers: ${res.status}`);
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching bookmakers:", error);
    return [];
  }
}


export async function GetArticlesByCategory(categorySlug: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/articles?` + 
    new URLSearchParams({
      "filters[category][slug][$eq]": categorySlug,
    });

  try {
    const res = await fetch(url);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Fetch error response:", errorBody);
      throw new Error(`Failed to fetch articles: ${res.status}`);
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}



