"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createDemoWeek } from "@/features/meal-planning/demo-meals";
import { RecipePlanner } from "@/features/recipes/recipe-planner";
import { ShoppingListView } from "@/features/meal-planning/shopping-list-view";
import { usePlannerWeek } from "@/features/meal-planning/use-planner-week";
import { WeeklyPlan } from "@/features/meal-planning/weekly-plan";
import { DashboardHeader, DashboardIntroduction, MobileNavigation, Sidebar, UtilityDialog } from "@/features/dashboard/dashboard-chrome";
import { useDashboardPreferences } from "@/features/dashboard/use-dashboard-preferences";
import { useShopping } from "@/features/shopping/shopping-context";

const PLANNER_VIEW = "Weekly plan";
const RECIPE_VIEWS = new Set(["Find recipes", "Favorite recipes"]);

function ShoppingDashboard() {
  const {
    items,
    meals,
    favoriteRecipes,
    addItem,
    addMeal,
    addMeals,
    removeMeal,
    removeMealIngredient,
    toggleMealIngredient,
    toggleItem,
    deleteItem,
    toggleFavoriteRecipe,
  } = useShopping();
  const { days, weekOffset, selectedDayKey, setSelectedDayKey, weekLabel, previousWeek, nextWeek, thisWeek } = usePlannerWeek();
  const { isDark, spaceName, displayName, toggleTheme, saveSpace } = useDashboardPreferences();
  const [activeView, setActiveView] = useState(PLANNER_VIEW);
  const [dialog, setDialog] = useState("");

  useEffect(() => {
    if (!dialog) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") setDialog("");
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [dialog]);

  const groceryEntries = useMemo(
    () => items.length + meals.reduce((count, meal) => count + meal.ingredients.length, 0),
    [items.length, meals],
  );
  const completed = useMemo(
    () => items.filter((item) => item.checked).length + meals.reduce(
      (count, meal) => count + meal.ingredients.filter((ingredient) => ingredient.checked).length,
      0,
    ),
    [items, meals],
  );
  const remaining = groceryEntries - completed;

  const goToView = useCallback((view) => setActiveView(view), []);
  const openDialog = useCallback((mode) => setDialog(mode), []);
  const closeDialog = useCallback(() => setDialog(""), []);

  const focusAddItem = useCallback(() => {
    setActiveView("Shopping list");
    window.requestAnimationFrame(() => document.getElementById("new-item-name")?.focus());
  }, []);

  const handleAddMeal = useCallback((recipe, dayKey) => {
    addMeal(recipe, dayKey);
    setActiveView(PLANNER_VIEW);
  }, [addMeal]);

  const handlePlanMeal = useCallback((dayKey) => {
    setSelectedDayKey(dayKey);
    setActiveView("Find recipes");
  }, [setSelectedDayKey]);

  const loadDemoWeek = useCallback(() => addMeals(createDemoWeek(days)), [addMeals, days]);

  return (
    <div className={`flex h-[100dvh] overflow-hidden bg-canvas text-ink antialiased ${isDark ? "dark" : ""}`}>
      <Sidebar
        remaining={remaining}
        completed={completed}
        activeView={activeView}
        onViewChange={goToView}
        spaceName={spaceName}
        displayName={displayName}
        onOpenDialog={openDialog}
        onFocusAdd={focusAddItem}
      />

      <main className="flex min-h-0 min-w-0 flex-1 flex-col" id="home">
        <DashboardHeader days={days} remaining={remaining} isDark={isDark} onToggleTheme={toggleTheme} onOpenDialog={openDialog} displayName={displayName} />
        <MobileNavigation activeView={activeView} onViewChange={goToView} />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 pt-3 sm:px-7 sm:pt-6 lg:overflow-hidden xl:px-12">
          <DashboardIntroduction activeView={activeView} spaceName={spaceName} weekLabel={weekLabel} />
          {activeView === PLANNER_VIEW ? (
            <WeeklyPlan
              days={days}
              meals={meals}
              favoriteRecipes={favoriteRecipes}
              onToggleFavoriteRecipe={toggleFavoriteRecipe}
              weekLabel={weekLabel}
              weekOffset={weekOffset}
              onPreviousWeek={previousWeek}
              onNextWeek={nextWeek}
              onThisWeek={thisWeek}
              onAddMeal={handlePlanMeal}
              onLoadDemo={loadDemoWeek}
              onRemoveMeal={removeMeal}
            />
          ) : RECIPE_VIEWS.has(activeView) ? (
            <RecipePlanner
              weekDays={days}
              selectedDayKey={selectedDayKey}
              onSelectedDayKeyChange={setSelectedDayKey}
              plannedMeals={meals}
              favoriteRecipes={favoriteRecipes}
              favoritesOnly={activeView === "Favorite recipes"}
              onToggleFavorite={toggleFavoriteRecipe}
              onPlanMeal={handleAddMeal}
            />
          ) : (
            <ShoppingListView
              items={items}
              meals={meals}
              days={days}
              onAddItem={addItem}
              onToggleItem={toggleItem}
              onToggleMealIngredient={toggleMealIngredient}
              onRemoveItem={deleteItem}
              onRemoveMealIngredient={removeMealIngredient}
              initialBasket={activeView === "In basket"}
            />
          )}

          <footer className="flex shrink-0 justify-between px-0.5 pt-3 text-[9px] text-muted">
            <span>Made for the everyday things.</span>
            <span className="hidden text-[8px] tracking-[1px] sm:block">PLAN A LITTLE, EAT WELL <b className="ml-1 text-xs text-peach">✳</b></span>
          </footer>
        </div>

        <UtilityDialog mode={dialog} onClose={closeDialog} spaceName={spaceName} displayName={displayName} onSave={saveSpace} />
      </main>
    </div>
  );
}

export default function Home() {
  return <ShoppingDashboard />;
}
