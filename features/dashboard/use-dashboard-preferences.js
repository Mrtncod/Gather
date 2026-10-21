"use client";

import { useCallback, useEffect, useState } from "react";

export function useDashboardPreferences() {
  const [isDark, setIsDark] = useState(false);
  const [spaceName, setSpaceName] = useState("My home");
  const [displayName, setDisplayName] = useState("Me");

  useEffect(() => {
    try {
      const darkTheme = window.localStorage.getItem("gather-theme") === "dark";
      setIsDark(darkTheme);
      document.documentElement.classList.toggle("dark", darkTheme);
      setSpaceName(
        window.localStorage.getItem("gather-space-name") || "My home",
      );
      setDisplayName(
        window.localStorage.getItem("gather-display-name") || "Me",
      );
    } catch {
      // The dashboard keeps usable defaults when browser storage is unavailable.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((current) => {
      const next = !current;
      document.documentElement.classList.toggle("dark", next);
      try {
        window.localStorage.setItem("gather-theme", next ? "dark" : "light");
      } catch {
        // The theme still changes for the current visit.
      }
      return next;
    });
  }, []);

  const saveSpace = useCallback(
    ({ spaceName: nextSpace, displayName: nextName }) => {
      const safeSpace = nextSpace.trim() || "My home";
      const safeName = nextName.trim() || "Me";
      setSpaceName(safeSpace);
      setDisplayName(safeName);
      try {
        window.localStorage.setItem("gather-space-name", safeSpace);
        window.localStorage.setItem("gather-display-name", safeName);
      } catch {
        // Updated labels remain available for the current visit.
      }
    },
    [],
  );

  return { isDark, spaceName, displayName, toggleTheme, saveSpace };
}
