"use client";

import { useCallback, useEffect, useState } from "react";
import { searchRecipes } from "@/features/recipes/recipe-api";
import { normalizeRecipe } from "@/features/recipes/recipe-utils";

export function useRecipeSearch(query, { enabled = true } = {}) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setError("");
      return undefined;
    }
    if (!query.trim()) {
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    async function loadRecipes() {
      setIsLoading(true);
      setError("");
      try {
        const results = await searchRecipes(query.trim(), {
          signal: controller.signal,
        });
        setRecipes(results.map(normalizeRecipe));
      } catch (reason) {
        if (reason.name !== "AbortError") {
          setError(reason.message || "Could not load recipes right now.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadRecipes();
    return () => controller.abort();
  }, [enabled, query, retryCount]);

  const retry = useCallback(() => setRetryCount((current) => current + 1), []);

  return {
    recipes,
    isLoading,
    error,
    retry,
  };
}
