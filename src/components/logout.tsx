"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Remove session variables
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("updatePassword");

    // Redirect to login
    router.replace("/login");
  }, [router]);

  return null; // nothing to render
}
