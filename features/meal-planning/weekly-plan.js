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
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 sm:px-5">
      <div>
        <p className="text-[9px] font-bold tracking-[1.1px] text-sage">
          YOUR MENU
        </p>
        <h2 className="mt-0.5 font-display text-base font-bold">{weekLabel}</h2>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="mr-1 hidden text-[10px] text-muted sm:inline">
          {mealCount} meals · {ingredientCount} ingredients
        </span>
        <button
          type="button"
          aria-label="Previous week"
          onClick={onPreviousWeek}
          className="grid h-9 w-9 place-items-center rounded-xl border border-line text-lg text-muted hover:bg-canvas"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={onThisWeek}
          disabled={weekOffset === 0}
          className="h-9 rounded-xl border border-line px-3 text-[10px] font-medium text-muted hover:bg-canvas disabled:cursor-default disabled:opacity-40"
        >
          This week
        </button>
        <button
          type="button"
          aria-label="Next week"
          onClick={onNextWeek}
          className="grid h-9 w-9 place-items-center rounded-xl border border-line text-lg text-muted hover:bg-canvas"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function EmptyWeekPrompt({ days, onAddMeal, onLoadDemo }) {
  return (
    <div className="flex shrink-0 flex-col gap-4 rounded-2xl border border-sage/30 bg-soft p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface text-lg text-sage shadow-sm"
        >
          ✳
        </span>
        <div>
          <h3 className="text-sm font-bold">Your week is a blank canvas.</h3>
          <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-muted">
            See how Gather connects recipes to your shopping list with a
            ready-made sample week. You can change or remove anything afterward.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2 pl-[52px] sm:pl-0">
        <button
          type="button"
          onClick={() => onAddMeal(days[0]?.key)}
          className="rounded-xl border border-line bg-surface px-3 py-2.5 text-[10px] font-semibold text-muted transition hover:bg-canvas"
        >
          Start my own
        </button>
        <button
          type="button"
          onClick={onLoadDemo}
          className="rounded-xl bg-forest px-3 py-2.5 text-[10px] font-semibold text-white transition hover:brightness-110 dark:bg-[#49614e]"
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
      className="flex gap-1.5 overflow-x-auto pb-1 md:hidden"
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
            className={`grid min-w-[55px] shrink-0 place-items-center gap-0.5 rounded-xl border px-2 py-2 transition ${selected ? "border-sage bg-[#eff4ef] text-forest dark:bg-[#26372c] dark:text-[#a6c1a8]" : "border-line bg-surface text-muted"}`}
          >
            <span className="text-[9px] font-semibold">{day.shortName}</span>
            <span className="text-[11px] font-bold">{day.date.getDate()}</span>
            <span className="text-[8px]">
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
    <section className="flex min-h-[420px] flex-1 flex-col gap-3 lg:min-h-0 lg:gap-4">
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
        <div className="md:hidden">
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
