"use client";

import { useCallback, useEffect, useState } from "react";
import { summarizeQuantities } from "@/features/meal-planning/meal-planning-utils";
import {
  GroceryComposer,
  ShoppingEmptyState,
  ShoppingEntryRow,
} from "@/features/meal-planning/shopping-list-components";
import { SHOPPING_STATUSES } from "@/features/meal-planning/shopping-list-utils";
import { useShoppingListData } from "@/features/meal-planning/use-shopping-list-data";

function ShoppingListControls({
  layout,
  onLayoutChange,
  status,
  onStatusChange,
  query,
  onQueryChange,
}) {
  return (
    <div className="mb-2 flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-fit items-center gap-1 rounded-lg bg-canvas p-1">
        {["Combined", "By meal"].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onLayoutChange(mode)}
            aria-pressed={layout === mode}
            className={`rounded-md px-2.5 py-1.5 text-[9px] ${layout === mode ? "bg-surface font-semibold text-forest shadow-sm dark:text-[#a6c1a8]" : "text-muted"}`}
          >
            {mode}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex flex-wrap gap-0.5">
          {SHOPPING_STATUSES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onStatusChange(option)}
              aria-pressed={status === option}
              className={`rounded-md px-2 py-1.5 text-[9px] ${status === option ? "bg-[#eff4ef] font-semibold text-forest dark:bg-[#26372c] dark:text-[#a6c1a8]" : "text-muted hover:bg-canvas"}`}
            >
              {option}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-label="Search shopping card"
          placeholder="Search"
          className="h-9 w-28 rounded-md border border-line bg-surface px-2 text-[10px] outline-none placeholder:text-muted focus:border-sage sm:h-8 sm:w-32"
        />
      </div>
    </div>
  );
}

function CombinedShoppingGroups({ groups, onToggle, onRemove }) {
  return (
    <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => {
        const total = summarizeQuantities(group.usages);
        return (
          <article
            key={group.name.toLowerCase()}
            className="min-w-0 rounded-lg border border-line bg-surface px-3 py-2.5"
          >
            <header className="mb-1 flex items-baseline justify-between gap-2">
              <b className="min-w-0 truncate text-[11px] font-semibold">
                {group.name}
              </b>
              <span className="shrink-0 text-[9px] font-medium text-sage">
                {total ||
                  `${group.usages.length} ${group.usages.length === 1 ? "use" : "uses"}`}
              </span>
            </header>
            {group.usages.map((entry) => (
              <ShoppingEntryRow
                key={entry.entryId}
                entry={entry}
                onToggle={onToggle}
                onRemove={onRemove}
              />
            ))}
          </article>
        );
      })}
    </div>
  );
}

function MealShoppingGroups({ groups, onToggle, onRemove }) {
  return (
    <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {groups.map(([key, group]) => (
        <article
          key={key}
          className="min-w-0 rounded-lg border border-line bg-surface px-3 py-2.5"
        >
          <header className="mb-1 flex items-baseline justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-[.8px] text-sage">
                {group.dayLabel} · {group.slot || "Groceries"}
              </p>
              <b className="block truncate text-[11px] font-semibold">
                {group.title}
              </b>
            </div>
            <span className="shrink-0 text-[9px] text-muted">
              {group.usages.length}
            </span>
          </header>
          {group.usages.map((entry) => (
            <ShoppingEntryRow
              key={entry.entryId}
              entry={entry}
              onToggle={onToggle}
              onRemove={onRemove}
            />
          ))}
        </article>
      ))}
    </div>
  );
}

export function ShoppingListView({
  items,
  meals,
  days,
  onAddItem,
  onToggleItem,
  onToggleMealIngredient,
  onRemoveItem,
  onRemoveMealIngredient,
  initialBasket = false,
}) {
  const [layout, setLayout] = useState("Combined");
  const [status, setStatus] = useState(
    initialBasket ? "In basket" : "Everything",
  );
  const [query, setQuery] = useState("");

  useEffect(
    () => setStatus(initialBasket ? "In basket" : "Everything"),
    [initialBasket],
  );

  const { visibleEntries, counts, combinedGroups, mealGroups } =
    useShoppingListData(items, meals, days, status, query);
  const toggleEntry = useCallback(
    (entry) => {
      if (entry.source === "meal")
        onToggleMealIngredient(entry.mealId, entry.id);
      else onToggleItem(entry.id);
    },
    [onToggleItem, onToggleMealIngredient],
  );
  const removeEntry = useCallback(
    (entry) => {
      if (entry.source === "meal")
        onRemoveMealIngredient(entry.mealId, entry.id);
      else onRemoveItem(entry.id);
    },
    [onRemoveItem, onRemoveMealIngredient],
  );

  return (
    <section className="flex min-h-0 min-w-0 flex-none flex-col rounded-xl border border-line bg-surface px-3.5 pt-4 shadow-sm sm:px-5 sm:pt-5 lg:min-h-0 lg:flex-1">
      <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[8px] font-bold tracking-[1.3px] text-muted">
            THE SHOPPING LIST
          </p>
          <h2 className="mt-1 font-display text-base font-bold">
            Everything you need
          </h2>
        </div>
      </div>
      <div className="mb-3 shrink-0">
        <GroceryComposer onAdd={onAddItem} />
      </div>
      <ShoppingListControls
        layout={layout}
        onLayoutChange={setLayout}
        status={status}
        onStatusChange={setStatus}
        query={query}
        onQueryChange={setQuery}
      />

      <div className="mb-2 flex shrink-0 items-center justify-between text-[9px] text-muted">
        <span>
          {counts.unique} ingredients · {visibleEntries.length} uses
        </span>
        <span>{counts.checked} checked</span>
      </div>

      <div className="min-h-[55vh] min-w-0 flex-none overflow-visible pb-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {!visibleEntries.length ? (
          <ShoppingEmptyState query={query} />
        ) : layout === "Combined" ? (
          <CombinedShoppingGroups
            groups={combinedGroups}
            onToggle={toggleEntry}
            onRemove={removeEntry}
          />
        ) : (
          <MealShoppingGroups
            groups={mealGroups}
            onToggle={toggleEntry}
            onRemove={removeEntry}
          />
        )}
      </div>

      <footer className="flex h-10 shrink-0 items-center justify-between border-t border-line text-[9px] text-muted">
        {/* <span>Meal ingredients stay connected to their day and dish.</span> */}
        <span>Your ingredients</span>
        <span>
          {days[0]?.dateLabel || ""} – {days[6]?.dateLabel || ""}
        </span>
      </footer>
    </section>
  );
}
