// hooks/useTheme.ts
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"Light" | "Dark">("Light");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "Light" | "Dark") || "Light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (mode: "Light" | "Dark") => {
    if (mode === "Dark") {
      document.documentElement.classList.add("dark"); // ✅ lowercase 'dark'
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const changeTheme = (newTheme: "Light" | "Dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return { theme, changeTheme };
}
