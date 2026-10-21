export const SHOPPING_CATEGORIES = [
  "Pantry",
  "Dairy & eggs",
  "Bakery",
  "Meat & fish",
  "Snacks",
  "Other",
];
export const SHOPPING_STATUSES = ["Everything", "Needed", "In basket"];
const CATEGORY_ORDER = [
  "Produce",
  "Dairy & eggs",
  "Bakery",
  "Pantry",
  "Meat & fish",
  "Snacks",
  "Other",
];

export function getShoppingEntries(items, meals, days) {
  const dayLabels = new Map(days.map((day) => [day.key, day.name.slice(0, 3)]));
  const looseEntries = items.map((item) => ({
    ...item,
    entryId: `loose:${item.id}`,
    source: "loose",
    mealName: "Standalone groceries",
    dayLabel: "Any day",
  }));
  const mealEntries = meals
    .filter((meal) => dayLabels.has(meal.dayKey))
    .flatMap((meal) =>
      meal.ingredients.map((ingredient) => ({
        ...ingredient,
        entryId: `meal:${meal.id}:${ingredient.id}`,
        source: "meal",
        mealId: meal.id,
        mealName: meal.name,
        dayKey: meal.dayKey,
        dayLabel: dayLabels.get(meal.dayKey),
        slot: meal.slot || "Lunch",
      })),
    );
  return [...looseEntries, ...mealEntries];
}

export function normalizeIngredientName(name) {
  const value = name.toLowerCase().trim().replace(/\s+/g, " ");
  if (value.endsWith("ies")) return `${value.slice(0, -3)}y`;
  if (value.endsWith("oes")) return value.slice(0, -2);
  if (/(ches|shes|sses|xes|zes)$/.test(value)) return value.slice(0, -2);
  if (value.endsWith("s") && !value.endsWith("ss")) return value.slice(0, -1);
  return value;
}

export function groupShoppingEntries(entries, days) {
  const combined = new Map();
  entries.forEach((entry) => {
    const key = normalizeIngredientName(entry.name);
    const group = combined.get(key) || {
      name: entry.name,
      category: entry.category || "Other",
      usages: [],
    };
    group.usages.push(entry);
    combined.set(key, group);
  });
  const combinedGroups = [...combined.values()].sort(
    (a, b) =>
      CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
      a.name.localeCompare(b.name),
  );

  const byMeal = new Map();
  entries.forEach((entry) => {
    const key = entry.source === "meal" ? entry.mealId : "standalone";
    const group = byMeal.get(key) || {
      title: entry.mealName,
      dayLabel: entry.dayLabel,
      slot: entry.slot,
      usages: [],
    };
    group.usages.push(entry);
    byMeal.set(key, group);
  });
  const dayOrder = new Map(days.map((day, index) => [day.key, index]));
  const mealGroups = [...byMeal.entries()].sort(([, a], [, b]) => {
    if (a.title === "Standalone groceries") return 1;
    if (b.title === "Standalone groceries") return -1;
    return (
      (dayOrder.get(a.usages[0]?.dayKey) ?? 99) -
        (dayOrder.get(b.usages[0]?.dayKey) ?? 99) ||
      a.title.localeCompare(b.title)
    );
  });

  return { combinedGroups, mealGroups };
}
