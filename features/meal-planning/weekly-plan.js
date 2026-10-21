"use client";

import { useEffect, useMemo, useState } from "react";
import { DayCard } from "@/features/meal-planning/day-card";
import { RecipeDetailsDialog } from "@/features/recipes/recipe-details-dialog";

function WeekNavigation({
  weekLabel,
  weekOffset,
  mealCount,
  ingredientCount,
  onPreviousWeek,
  onNextWeek,
  onThisWeek,
}) {
  return (
    <div className="flex shrink-0 flex-nowrap items-center justify-between gap-1.5 rounded-2xl border border-line bg-surface px-2.5 py-2.5 sm:gap-3 sm:px-5 sm:py-3">
      <div>
        <p className="text-[9px] font-bold tracking-[1.1px] text-sage">
          YOUR MENU
        </p>
        <h2 className="mt-0.5 whitespace-nowrap font-display text-[13px] font-bold sm:text-base">{weekLabel}</h2>
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <span className="mr-1 hidden text-[10px] text-muted sm:inline">
          {mealCount} meals · {ingredientCount} ingredients
        </span>
        <button
          type="button"
          aria-label="Previous week"
          onClick={onPreviousWeek}
          className="grid h-8 w-8 place-items-center rounded-xl border border-line text-lg text-muted hover:bg-canvas sm:h-9 sm:w-9"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={onThisWeek}
          disabled={weekOffset === 0}
          className="h-8 whitespace-nowrap rounded-xl border border-line px-2 text-[9px] font-medium text-muted hover:bg-canvas disabled:cursor-default disabled:opacity-40 sm:h-9 sm:px-3 sm:text-[10px]"
        >
          This week
        </button>
        <button
          type="button"
          aria-label="Next week"
          onClick={onNextWeek}
          className="grid h-8 w-8 place-items-center rounded-xl border border-line text-lg text-muted hover:bg-canvas sm:h-9 sm:w-9"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function EmptyWeekPrompt({ days, onAddMeal, onLoadDemo }) {
  return (
    <div className="flex shrink-0 flex-col gap-2.5 rounded-2xl border border-sage/30 bg-soft p-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-4">
      <div className="flex items-start gap-2 sm:gap-3">
        <span
          aria-hidden="true"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface text-base text-sage shadow-sm sm:h-10 sm:w-10 sm:rounded-xl sm:text-lg"
        >
          ✳
        </span>
        <div className="min-w-0">
          <h3 className="text-[13px] font-bold leading-tight sm:text-sm">Your week is a blank canvas.</h3>
          <p className="mt-0.5 max-w-xl text-[10px] leading-snug text-muted sm:mt-1 sm:text-[11px] sm:leading-relaxed">
            See how Gather connects recipes to your shopping list with a
            ready-made sample week. You can change or remove anything afterward.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-1.5 pl-10 sm:gap-2 sm:pl-0">
        <button
          type="button"
          onClick={() => onAddMeal(days[0]?.key)}
          className="rounded-lg border border-line bg-surface px-2.5 py-2 text-[9px] font-semibold text-muted transition hover:bg-canvas sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-[10px]"
        >
          Start my own
        </button>
        <button
          type="button"
          onClick={onLoadDemo}
          className="rounded-lg bg-forest px-2.5 py-2 text-[9px] font-semibold text-white transition hover:brightness-110 dark:bg-[#49614e] sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-[10px]"
        >
          Try sample week
        </button>
      </div>
    </div>
  );
}

function MobileDaySelector({ days, selectedDay, mealsFor, onSelectDay }) {
  return (
    <div
      className="grid grid-cols-4 gap-1.5 pb-1 sm:grid-cols-7 md:hidden"
      aria-label="Choose a day"
    >
      {days.map((day) => {
        const selected = selectedDay?.key === day.key;
        const count = mealsFor(day).length;
        return (
          <button
            key={day.key}
            type="button"
            onClick={() => onSelectDay(day.key)}
            aria-pressed={selected}
            className={`grid min-w-0 place-items-center gap-0.5 rounded-xl border px-1 py-1.5 transition ${selected ? "border-sage bg-[#eff4ef] text-forest dark:bg-[#26372c] dark:text-[#a6c1a8]" : "border-line bg-surface text-muted"}`}
          >
            <span className="text-[9px] font-semibold">{day.shortName}</span>
            <span className="text-[11px] font-bold">{day.date.getDate()}</span>
            <span className="text-[8px] leading-none">
              {count ? `${count} planned` : "Free"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function WeeklyPlan({
  days,
  meals,
  favoriteRecipes = [],
  weekLabel,
  onPreviousWeek,
  onNextWeek,
  onThisWeek,
  onAddMeal,
  onLoadDemo,
  onRemoveMeal,
  onToggleFavoriteRecipe,
  weekOffset,
}) {
  const favoriteIds = useMemo(
    () => new Set(favoriteRecipes.map((recipe) => recipe.mealId)),
    [favoriteRecipes],
  );
  const mealsThisWeek = useMemo(
    () => meals.filter((meal) => days.some((day) => day.key === meal.dayKey)),
    [days, meals],
  );
  const ingredientCount = mealsThisWeek.reduce(
    (count, meal) => count + meal.ingredients.length,
    0,
  );
  const [selectedDayKey, setSelectedDayKey] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    setSelectedDayKey(
      days.find((day) => day.isToday)?.key || days[0]?.key || "",
    );
  }, [days]);

  const selectedDay = days.find((day) => day.key === selectedDayKey) || days[0];
  const mealsFor = (day) =>
    mealsThisWeek.filter((meal) => meal.dayKey === day.key);

  return (
    <section className="flex min-h-0 flex-none flex-col gap-2.5 lg:min-h-0 lg:flex-1 lg:gap-4">
      <WeekNavigation
        weekLabel={weekLabel}
        weekOffset={weekOffset}
        mealCount={mealsThisWeek.length}
        ingredientCount={ingredientCount}
        onPreviousWeek={onPreviousWeek}
        onNextWeek={onNextWeek}
        onThisWeek={onThisWeek}
      />

      {!mealsThisWeek.length && days.length > 0 && (
        <EmptyWeekPrompt
          days={days}
          onAddMeal={onAddMeal}
          onLoadDemo={onLoadDemo}
        />
      )}

      <MobileDaySelector
        days={days}
        selectedDay={selectedDay}
        mealsFor={mealsFor}
        onSelectDay={setSelectedDayKey}
      />

      {selectedDay && (
        <div className="shrink-0 md:hidden">
          <DayCard
            day={selectedDay}
            meals={mealsFor(selectedDay)}
            favoriteIds={favoriteIds}
            onAddMeal={onAddMeal}
            onRemoveMeal={onRemoveMeal}
            onToggleFavoriteRecipe={onToggleFavoriteRecipe}
            onViewRecipe={setSelectedRecipe}
            compact
          />
        </div>
      )}

      <div className="hidden min-h-0 flex-1 overflow-auto md:block 2xl:overflow-visible">
        <div className="grid grid-cols-2 content-start items-start gap-3 xl:grid-cols-3 2xl:grid-cols-7">
          {days.map((day) => (
            <DayCard
              key={day.key}
              day={day}
              meals={mealsFor(day)}
              favoriteIds={favoriteIds}
              onAddMeal={onAddMeal}
              onRemoveMeal={onRemoveMeal}
              onToggleFavoriteRecipe={onToggleFavoriteRecipe}
              onViewRecipe={setSelectedRecipe}
            />
          ))}
        </div>
      </div>

      {selectedRecipe && (
        <RecipeDetailsDialog
          meal={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </section>
  );
}
