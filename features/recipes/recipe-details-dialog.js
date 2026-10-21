"use client";

import { useEffect, useState } from "react";
import { getRecipeDetails } from "@/features/recipes/recipe-api";

function splitNumberedInstructions(instructions) {
  if (!/(?:^|\s)\d+[.)]\s/.test(instructions)) return null;
  return instructions
    .split(/\s+(?=\d+[.)]\s)/)
    .map((step) => step.replace(/^\d+[.)]\s*/, "").trim())
    .filter(Boolean);
}

export function RecipeDetailsDialog({ meal, onClose }) {
  const [recipeUrl, setRecipeUrl] = useState(meal.source || meal.youtube || "");
  const [recipeIsVideo, setRecipeIsVideo] = useState(
    !meal.source && Boolean(meal.youtube),
  );

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (recipeUrl || !/^\d+$/.test(String(meal.mealId || ""))) return undefined;
    const controller = new AbortController();
    getRecipeDetails(meal.mealId, { signal: controller.signal })
      .then((details) => {
        if (details?.strSource) {
          setRecipeUrl(details.strSource);
          setRecipeIsVideo(false);
        } else if (details?.strYoutube) {
          setRecipeUrl(details.strYoutube);
          setRecipeIsVideo(true);
        }
      })
      .catch(() => {
        // Saved instructions remain available if the optional link lookup fails.
      });
    return () => controller.abort();
  }, [meal.mealId, recipeUrl]);

  const instructions = meal.instructions?.trim();
  const instructionSteps = instructions
    ? splitNumberedInstructions(instructions)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-black/50 p-0 backdrop-blur-sm sm:place-items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="planned-recipe-title"
        className="max-h-[88dvh] w-full overflow-y-auto rounded-t-3xl border border-line bg-surface shadow-2xl sm:max-w-2xl sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-surface/95 p-5 backdrop-blur sm:p-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[1.2px] text-sage">
              {meal.slot || "Recipe"} · Recipe details
            </p>
            <h2
              id="planned-recipe-title"
              className="mt-1 font-display text-xl font-bold tracking-tight sm:text-2xl"
            >
              {meal.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close recipe details"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-xl text-muted hover:bg-canvas"
          >
            ×
          </button>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          <div>
            {meal.image && (
              <div
                role="img"
                aria-label={`Photo of ${meal.name}`}
                className="aspect-[4/3] rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: `url("${meal.image}")` }}
              />
            )}
            <h3 className="mb-3 mt-5 text-sm font-bold">
              Ingredients{" "}
              <span className="font-normal text-muted">
                ({meal.ingredients.length})
              </span>
            </h3>
            <ul className="grid gap-2">
              {meal.ingredients.map((ingredient, index) => (
                <li
                  key={
                    ingredient.id ||
                    `${ingredient.name}-${ingredient.quantity}-${index}`
                  }
                  className="flex items-start justify-between gap-3 border-b border-line/70 pb-2 text-xs"
                >
                  <span>{ingredient.name}</span>
                  {ingredient.quantity && (
                    <span className="shrink-0 text-right text-muted">
                      {ingredient.quantity}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold">Preparation</h3>
            {instructionSteps ? (
              <ol className="grid list-decimal gap-3 pl-5 text-sm leading-7 text-muted">
                {instructionSteps.map((step, index) => (
                  <li key={`step-${index}`}>{step}</li>
                ))}
              </ol>
            ) : instructions ? (
              <p className="whitespace-pre-line text-sm leading-7 text-muted">
                {instructions.replace(/\r\n/g, "\n")}
              </p>
            ) : (
              <p className="rounded-xl border border-dashed border-line p-4 text-sm leading-6 text-muted">
                No preparation steps were provided for this recipe. You can
                still use the ingredient list to plan your meal.
              </p>
            )}
            {recipeUrl && (
              <a
                href={recipeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-forest px-4 text-xs font-semibold text-white transition hover:brightness-110 dark:bg-[#49614e]"
              >
                {recipeIsVideo
                  ? "Watch recipe video ↗"
                  : "Open original recipe ↗"}
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
