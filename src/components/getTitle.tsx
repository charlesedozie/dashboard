"use client";

import { useEffect, useState } from "react";

interface TitleFetcherProps {
  apiEndpoint: string;
  placeholder?: string; // Optional placeholder, default = "N/A"
}

export default function TitleFetcher({
  apiEndpoint,
  placeholder = "N/A",
}: TitleFetcherProps) {
  const [title, setTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchTitle = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/${apiEndpoint}`);
      console.log("Raw response:", res);
      const data = await res.json();
      console.log("Data:", data);

      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      // ✅ Check if data.data.title exists, otherwise set null
      const fetchedTitle = data?.data?.title || null;
      setTitle(fetchedTitle);
    } catch (err: any) {
      console.error("Fetch error:", err.message);
      setError("Failed to fetch");
      setTitle(null);
    } finally {
      setLoading(false);
    }
  };

  if (apiEndpoint) {
    fetchTitle();
  }
}, [apiEndpoint]);


  // Display loading, error, title, or placeholder
  if (loading) return <span>Loading...</span>;
  if (error) return <span  style={{ all: "inherit" }}>{placeholder}</span>;
  return (title || placeholder);
}


export function UserName({
  apiEndpoint,
  placeholder = "N/A",
}: TitleFetcherProps) {
  const [title, setTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchTitle = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/${apiEndpoint}`);
      console.log("Raw response:", res);
      const data = await res.json();
      console.log("Data:", data);

      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      // ✅ Check if data.data.title exists, otherwise set null
      const fetchedTitle = data?.data?.fullName || null;
      setTitle(fetchedTitle);
    } catch (err: any) {
      console.error("Fetch error:", err.message);
      setError("Failed to fetch");
      setTitle(null);
    } finally {
      setLoading(false);
    }
  };

  if (apiEndpoint) {
    fetchTitle();
  }
}, [apiEndpoint]);


  // Display loading, error, title, or placeholder
  if (loading) return <span>Loading...</span>;
  if (error) return <span  style={{ all: "inherit" }}>{placeholder}</span>;
  return (title || placeholder);
}
