"use client";

import { useState } from "react";
import { SHOPPING_CATEGORIES } from "@/features/meal-planning/shopping-list-utils";

function CheckButton({ entry, onToggle }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={entry.checked}
      aria-label={`${entry.checked ? "Uncheck" : "Check off"} ${entry.name} for ${entry.mealName}`}
      onClick={() => onToggle(entry)}
      className={`grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border text-[10px] text-white ${entry.checked ? "border-sage bg-sage" : "border-[#d8ded8] bg-surface hover:border-sage"}`}
    >
      {entry.checked && "✓"}
    </button>
  );
}

export function ShoppingEntryRow({ entry, onToggle, onRemove }) {
  return (
    <div className="flex min-w-0 items-center gap-2 border-t border-line/60 px-1 py-2">
      <CheckButton entry={entry} onToggle={onToggle} />
      <span className="min-w-0 flex-1">
        <b
          className={`block truncate text-[10px] font-medium ${entry.checked ? "text-muted line-through" : "text-ink"}`}
        >
          {entry.name}
        </b>
        <small className="block truncate text-[9px] text-muted">
          {entry.dayLabel} · {entry.mealName}
        </small>
      </span>
      <span className="shrink-0 rounded bg-canvas px-2 py-1 text-[9px] text-muted">
        {entry.quantity || "1"}
      </span>
      <button
        type="button"
        onClick={() => onRemove(entry)}
        aria-label={`Remove ${entry.name} ${entry.source === "meal" ? `from ${entry.mealName}` : "from shopping list"}`}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-base text-muted hover:bg-canvas hover:text-[#bd8182]"
      >
        ×
      </button>
    </div>
  );
}

export function GroceryComposer({ onAdd }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("Pantry");

  function submit(event) {
    event.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), quantity: quantity.trim() || "1", category });
    setName("");
    setQuantity("");
  }

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-[minmax(0,1fr)_76px] gap-2 rounded-lg border border-line bg-canvas p-2 sm:grid-cols-[minmax(0,1fr)_84px_140px_104px]"
    >
      <input
        id="new-item-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        aria-label="Grocery name"
        placeholder="Add a grocery item..."
        className="h-10 min-w-0 rounded-md border border-line bg-surface px-2.5 text-[11px] outline-none placeholder:text-muted focus:border-sage sm:h-9"
      />
      <input
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
        aria-label="Grocery quantity"
        placeholder="Qty"
        className="h-10 min-w-0 rounded-md border border-line bg-surface px-2 text-[10px] outline-none placeholder:text-muted focus:border-sage sm:h-9"
      />
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        aria-label="Grocery category"
        className="col-span-2 h-10 min-w-0 rounded-md border border-line bg-surface px-2 text-[11px] text-ink outline-none dark:[color-scheme:dark] sm:col-span-1 sm:h-9"
      >
        {SHOPPING_CATEGORIES.map((item) => (
          <option
            key={item}
            className="bg-surface text-ink dark:bg-[#1d231f] dark:text-[#ebefeb]"
          >
            {item}
          </option>
        ))}
      </select>
      <button className="col-span-2 h-10 rounded-md bg-forest text-[11px] font-semibold text-white dark:bg-[#49614e] sm:col-span-1 sm:h-9 sm:text-[10px]">
        Add item
      </button>
    </form>
  );
}

export function ShoppingEmptyState({ query }) {
  const hasQuery = Boolean(query.trim());
  return (
    <div className="grid h-40 place-items-center text-center">
      <div>
        <span className="text-2xl text-peach">✳</span>
        <p className="mt-1 text-[11px] font-semibold">
          {hasQuery
            ? "No groceries match that search"
            : "Your shopping card is empty"}
        </p>
        <p className="mt-1 text-[10px] text-muted">
          {hasQuery
            ? "Try a different ingredient."
            : "Plan a meal or add groceries above."}
        </p>
      </div>
    </div>
  );
}
