"use client";

import { useState } from "react";
import { categorizeIngredient } from "@/features/recipes/recipe-utils";

export function CustomRecipeForm({ onCancel, onCreate }) {
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [rows, setRows] = useState([{ name: "", quantity: "" }]);

  function updateRow(index, key, value) {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row,
      ),
    );
  }

  function submit(event) {
    event.preventDefault();
    const ingredients = rows
      .filter((row) => row.name.trim())
      .map((row) => ({
        name: row.name.trim(),
        quantity: row.quantity.trim() || "To taste",
        category: categorizeIngredient(row.name),
      }));
    if (!name.trim() || !ingredients.length) return;

    onCreate({
      mealId: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      category: "Your recipe",
      area: "Made by you",
      instructions: instructions.trim(),
      ingredients,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-xl border border-sage/40 bg-canvas p-4 sm:p-5 lg:max-h-[55vh] lg:overflow-y-auto lg:overscroll-contain"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold">Create your own recipe</h3>
          <p className="mt-1 text-[10px] text-muted">
            Add a dish and its ingredients. Amounts can stay flexible.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close recipe form"
          className="text-lg text-muted"
        >
          ×
        </button>
      </div>

      <label className="grid gap-1 text-[10px] font-semibold text-muted">
        Dish name
        <input
          autoFocus
          required
          maxLength={70}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Mum’s lentil soup"
          className="h-10 rounded-md border border-line bg-surface px-3 text-xs text-ink outline-none focus:border-sage"
        />
      </label>

      <div>
        <button
          type="button"
          aria-expanded={showInstructions}
          aria-controls="custom-recipe-instructions"
          onClick={() => setShowInstructions((open) => !open)}
          className="flex min-h-8 items-center gap-2 text-[10px] font-semibold text-forest transition hover:text-sage dark:text-[#a6c1a8]"
        >
          <span aria-hidden="true">{showInstructions ? "−" : "＋"}</span>
          Preparation steps{" "}
          <span className="font-normal text-muted">Optional</span>
        </button>
        {showInstructions && (
          <textarea
            id="custom-recipe-instructions"
            maxLength={3000}
            rows={3}
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            placeholder="Add the steps, timings, or notes you want to remember…"
            className="mt-1.5 w-full resize-y rounded-md border border-line bg-surface px-3 py-2 text-xs leading-relaxed text-ink outline-none focus:border-sage"
          />
        )}
      </div>

      <div className="grid gap-2">
        <span className="text-[10px] font-semibold text-muted">
          Ingredients
        </span>
        {rows.map((row, index) => (
          <div
            key={`ingredient-row-${index}`}
            className="grid grid-cols-[minmax(0,1fr)_90px_32px] gap-2"
          >
            <input
              aria-label={`Ingredient ${index + 1}`}
              value={row.name}
              onChange={(event) => updateRow(index, "name", event.target.value)}
              placeholder="Ingredient"
              className="h-10 min-w-0 rounded-md border border-line bg-surface px-3 text-[11px] outline-none focus:border-sage"
            />
            <input
              aria-label={`Amount for ingredient ${index + 1}`}
              value={row.quantity}
              onChange={(event) =>
                updateRow(index, "quantity", event.target.value)
              }
              placeholder="Amount"
              className="h-10 min-w-0 rounded-md border border-line bg-surface px-2 text-[11px] outline-none focus:border-sage"
            />
            <button
              type="button"
              aria-label={`Remove ingredient ${index + 1}`}
              disabled={rows.length === 1}
              onClick={() =>
                setRows((current) =>
                  current.filter((_, rowIndex) => rowIndex !== index),
                )
              }
              className="rounded-md border border-line text-muted disabled:opacity-30"
            >
              −
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-between gap-2 lg:sticky lg:bottom-0 lg:z-10 lg:bg-canvas/95 lg:pb-1 lg:pt-2 lg:backdrop-blur">
        <button
          type="button"
          onClick={() =>
            setRows((current) => [...current, { name: "", quantity: "" }])
          }
          className="rounded-md border border-line px-3 py-2 text-[10px] font-semibold text-muted hover:bg-surface"
        >
          ＋ Add ingredient
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-2 text-[10px] text-muted"
          >
            Cancel
          </button>
          <button className="rounded-md bg-forest px-4 py-2 text-[10px] font-semibold text-white dark:bg-[#49614e]">
            Add to this week
          </button>
        </div>
      </div>
    </form>
  );
}
