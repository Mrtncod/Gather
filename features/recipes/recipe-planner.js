"use client";

import { useMemo, useState } from "react";
import { CustomRecipeForm } from "@/features/recipes/custom-recipe-form";
import { RecipeCard } from "@/features/recipes/recipe-card";
import { RecipeDetailsDialog } from "@/features/recipes/recipe-details-dialog";
import { useRecipeSearch } from "@/features/recipes/use-recipe-search";

const QUICK_SEARCHES = ["chicken", "pasta", "salmon", "curry"];
const MEAL_SLOTS = ["Breakfast", "Lunch", "Dinner"];

function RecipeControls({
  favoritesOnly,
  query,
  onQueryChange,
  onSearch,
  weekDays,
  selectedDayKey,
  onSelectedDayKeyChange,
  slot,
  onSlotChange,
  plannedMeals,
}) {
  return (
    <div className="grid shrink-0 gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,430px)] lg:items-center">
      <div className="hidden lg:block">
        <p className="text-[9px] font-bold tracking-[1.2px] text-sage">
          {favoritesOnly ? "YOUR COOKBOOK" : "A LITTLE INSPIRATION"}
        </p>
        <h2 className="mt-1 font-display text-lg font-bold tracking-tight">
          {favoritesOnly ? "Recipes you saved" : "What should we cook?"}
        </h2>
        <p className="mt-1 max-w-lg text-[11px] leading-relaxed text-muted">
          {favoritesOnly
            ? "Your favorite recipes are ready to add to any day."
            : "Choose a day and meal, then add a recipe to your week — or create one of your own."}
        </p>
      </div>
      <div className="grid min-w-0 gap-2 sm:grid-cols-2">
        {!favoritesOnly && (
          <form
            onSubmit={onSearch}
            className="flex h-11 min-w-0 gap-2 sm:col-span-2"
          >
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              aria-label="Search recipes"
              placeholder="Try chicken, pasta, curry..."
              className="min-w-0 flex-1 rounded-md border border-line bg-canvas px-3 text-xs outline-none focus:border-sage"
            />
            <button className="rounded-md bg-forest px-4 text-[10px] font-semibold text-white dark:bg-[#49614e]">
              Search
            </button>
          </form>
        )}
        <select
          value={selectedDayKey}
          onChange={(event) => onSelectedDayKeyChange(event.target.value)}
          aria-label="Choose a day"
          className="h-11 min-w-0 rounded-md border border-line bg-canvas px-2.5 text-[11px] text-ink outline-none dark:[color-scheme:dark]"
        >
          {weekDays.map((day) => (
            <option
              key={day.key}
              value={day.key}
              className="bg-surface text-ink dark:bg-[#1d231f] dark:text-[#ebefeb]"
            >
              {day.name} · {day.dateLabel}
            </option>
          ))}
        </select>
        <select
          value={slot}
          onChange={(event) => onSlotChange(event.target.value)}
          aria-label="Choose a meal"
          className="h-11 min-w-0 rounded-md border border-line bg-canvas px-2.5 text-[11px] text-ink outline-none dark:[color-scheme:dark]"
        >
          {MEAL_SLOTS.map((value) => (
            <option
              key={value}
              value={value}
              className="bg-surface text-ink dark:bg-[#1d231f] dark:text-[#ebefeb]"
            >
              {value}
              {plannedMeals.some(
                (meal) => meal.dayKey === selectedDayKey && meal.slot === value,
              )
                ? " · planned"
                : ""}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function RecipeResults({
  favoritesOnly,
  recipes,
  favoriteRecipes,
  isLoading,
  error,
  searchTerm,
  onRetry,
  ...cardProps
}) {
  const visibleRecipes = favoritesOnly ? favoriteRecipes : recipes;
  const favoriteIds = useMemo(
    () => new Set(favoriteRecipes.map((recipe) => recipe.mealId)),
    [favoriteRecipes],
  );

  if (isLoading)
    return (
      <div className="grid h-48 place-items-center text-xs text-muted">
        Finding something delicious…
      </div>
    );
  if (error) {
    return (
      <div className="grid h-48 place-items-center text-center text-xs text-muted">
        <div>
          <p>{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 font-semibold text-forest dark:text-[#a6c1a8]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  if (visibleRecipes.length) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {visibleRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.mealId}
            recipe={recipe}
            isFavorite={favoriteIds.has(recipe.mealId)}
            {...cardProps}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid min-h-52 place-items-center text-center text-xs text-muted">
      <div>
        <span className="text-2xl text-peach">✳</span>
        <p className="mt-2 font-semibold text-ink">
          {favoritesOnly
            ? "No favorite recipes yet"
            : `No recipes found for “${searchTerm}”`}
        </p>
        <p className="mt-1">
          {favoritesOnly
            ? "Tap the heart on a recipe to save it here."
            : "Try another search or create your own recipe."}
        </p>
      </div>
    </div>
  );
}

export function RecipePlanner({
  weekDays,
  selectedDayKey,
  onSelectedDayKeyChange,
  plannedMeals,
  favoriteRecipes,
  onToggleFavorite,
  onPlanMeal,
  favoritesOnly = false,
}) {
  const [query, setQuery] = useState("chicken");
  const [searchTerm, setSearchTerm] = useState("chicken");
  const [slot, setSlot] = useState("Lunch");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const { recipes, isLoading, error, retry } = useRecipeSearch(searchTerm, {
    enabled: !favoritesOnly,
  });
  const slotTaken = plannedMeals.some(
    (meal) => meal.dayKey === selectedDayKey && meal.slot === slot,
  );

  function submitSearch(event) {
    event.preventDefault();
    if (query.trim()) setSearchTerm(query.trim());
  }

  function chooseQuickSearch(term) {
    setQuery(term);
    setSearchTerm(term);
  }

  function createRecipe(recipe) {
    onPlanMeal({ ...recipe, slot }, selectedDayKey);
    setShowCustomForm(false);
  }

  return (
    <section className="flex min-h-0 flex-none flex-col gap-4 lg:min-h-0 lg:flex-1">
      <RecipeControls
        favoritesOnly={favoritesOnly}
        query={query}
        onQueryChange={setQuery}
        onSearch={submitSearch}
        weekDays={weekDays}
        selectedDayKey={selectedDayKey}
        onSelectedDayKeyChange={onSelectedDayKeyChange}
        slot={slot}
        onSlotChange={setSlot}
        plannedMeals={plannedMeals}
      />

      {!favoritesOnly && (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="shrink-0 text-[9px] font-semibold text-muted">
              POPULAR:
            </span>
            {QUICK_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => chooseQuickSearch(term)}
                className={`shrink-0 rounded-full border px-3 py-2 text-[10px] capitalize transition ${searchTerm === term ? "border-sage bg-[#eff4ef] text-forest dark:bg-[#26372c] dark:text-[#a6c1a8]" : "border-line text-muted hover:bg-surface"}`}
              >
                {term}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowCustomForm((visible) => !visible)}
            aria-expanded={showCustomForm}
            className="shrink-0 rounded-full border border-sage/50 px-3 py-2 text-[10px] font-semibold text-forest hover:bg-surface dark:text-[#a6c1a8]"
          >
            {showCustomForm ? "Close recipe form" : "＋ Create a recipe"}
          </button>
        </div>
      )}

      {!favoritesOnly && showCustomForm &&
        (slotTaken ? (
          <div className="rounded-xl border border-line bg-canvas p-4 text-[11px] text-muted">
            {slot} is already planned for this day. Choose another meal slot to
            add your recipe.
          </div>
        ) : (
          <CustomRecipeForm
            onCancel={() => setShowCustomForm(false)}
            onCreate={createRecipe}
          />
        ))}

      <div className="min-h-0 flex-none overflow-visible pb-1 lg:flex-1 lg:overflow-y-auto">
        <RecipeResults
          favoritesOnly={favoritesOnly}
          recipes={recipes}
          favoriteRecipes={favoriteRecipes}
          isLoading={isLoading}
          error={error}
          searchTerm={searchTerm}
          onRetry={retry}
          dayKey={selectedDayKey}
          slot={slot}
          plannedMeals={plannedMeals}
          slotTaken={slotTaken}
          onToggleFavorite={onToggleFavorite}
          onPlanMeal={onPlanMeal}
          onViewRecipe={setSelectedRecipe}
        />
      </div>

      {!favoritesOnly && (
        <p className="shrink-0 text-center text-[9px] text-muted">
          Recipes and ingredient details via{" "}
          <a
            href="https://www.themealdb.com/api.php"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-line underline-offset-2 hover:text-ink"
          >
            TheMealDB
          </a>
          .
        </p>
      )}

      {selectedRecipe && (
        <RecipeDetailsDialog
          meal={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </section>
  );
}
