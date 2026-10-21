"use client";

import { normalizeRecipe } from "@/features/recipes/recipe-utils";

export function RecipeCard({
  recipe: rawRecipe,
  dayKey,
  slot,
  plannedMeals,
  isFavorite,
  slotTaken,
  onToggleFavorite,
  onPlanMeal,
  onViewRecipe,
}) {
  const recipe = normalizeRecipe(rawRecipe);
  const alreadyPlanned = plannedMeals.some(
    (entry) =>
      entry.dayKey === dayKey &&
      entry.mealId === recipe.mealId &&
      entry.slot === slot,
  );

  return (
    <article className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
      <div
        role="img"
        aria-label={`Photo of ${recipe.name}`}
        className="relative h-44 shrink-0 bg-cover bg-center sm:h-48"
        style={{
          backgroundImage: recipe.image ? `url("${recipe.image}")` : "none",
        }}
      >
        <span className="m-3 inline-flex rounded-full bg-surface/90 px-2.5 py-1 text-[9px] font-semibold text-ink shadow-sm">
          {recipe.area || "Your kitchen"}
        </span>
        <button
          type="button"
          onClick={() => onToggleFavorite(recipe)}
          aria-label={`${isFavorite ? "Remove from" : "Add to"} favorite recipes: ${recipe.name}`}
          aria-pressed={isFavorite}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-surface/95 text-lg shadow-sm transition hover:scale-105 ${isFavorite ? "text-[#d58f81]" : "text-muted hover:text-[#d58f81]"}`}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[1px] text-sage">
          {recipe.category || "Recipe idea"} · {recipe.ingredients.length}{" "}
          ingredients
        </p>
        <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug tracking-tight">
          {recipe.name}
        </h3>
        <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-muted">
          {recipe.instructions?.replace(/\s+/g, " ").trim() ||
            "A delicious idea for your next meal."}
        </p>
        <button
          type="button"
          onClick={() => onViewRecipe(recipe)}
          aria-label={`Read full recipe for ${recipe.name}`}
          className="mt-1.5 self-start text-[10px] font-semibold text-forest underline decoration-sage/50 underline-offset-2 transition hover:text-sage dark:text-[#a6c1a8]"
        >
          See full recipe ↗
        </button>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
            <span
              key={`${ingredient.name}-${index}`}
              className="rounded-md bg-canvas px-2 py-1 text-[9px] text-muted"
            >
              {ingredient.name}
            </span>
          ))}
          {recipe.ingredients.length > 4 && (
            <span className="rounded-md bg-canvas px-2 py-1 text-[9px] text-muted">
              +{recipe.ingredients.length - 4}
            </span>
          )}
        </div>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <button
            type="button"
            disabled={slotTaken}
            onClick={() => onPlanMeal({ ...recipe, slot }, dayKey)}
            className="flex-1 rounded-md bg-forest px-3 py-3 text-[11px] font-semibold text-white transition hover:brightness-110 disabled:cursor-default disabled:bg-sage dark:bg-[#49614e]"
          >
            {alreadyPlanned
              ? `${slot} planned`
              : slotTaken
                ? `${slot} is filled`
                : `Add to ${slot.toLowerCase()}`}
          </button>
          {(recipe.source || recipe.youtube) && (
            <a
              href={recipe.source || recipe.youtube}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line px-3 py-3 text-[10px] font-medium text-muted hover:bg-canvas"
            >
              {recipe.source ? "Recipe" : "Video"} ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
