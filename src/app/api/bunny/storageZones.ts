import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch("https://api.bunny.net/storagezone", {
      method: "GET",
      headers: {
        "AccessKey": process.env.BUNNY_STORAGE_ACCESS_KEY!, // store in .env.local
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching zones: ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
