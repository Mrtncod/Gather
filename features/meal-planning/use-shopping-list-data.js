"use client";

import { useMemo } from "react";
import {
  getShoppingEntries,
  groupShoppingEntries,
  normalizeIngredientName,
} from "@/features/meal-planning/shopping-list-utils";

export function useShoppingListData(items, meals, days, status, query) {
  const entries = useMemo(
    () => getShoppingEntries(items, meals, days),
    [days, items, meals],
  );
  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (status === "Needed" && entry.checked) return false;
      if (status === "In basket" && !entry.checked) return false;
      return entry.name.toLowerCase().includes(normalizedQuery);
    });
  }, [entries, query, status]);
  const counts = useMemo(
    () => ({
      unique: new Set(
        visibleEntries.map((entry) => normalizeIngredientName(entry.name)),
      ).size,
      checked: visibleEntries.filter((entry) => entry.checked).length,
    }),
    [visibleEntries],
  );
  const groups = useMemo(
    () => groupShoppingEntries(visibleEntries, days),
    [days, visibleEntries],
  );

  return { visibleEntries, counts, ...groups };
}
