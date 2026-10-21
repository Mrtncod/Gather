const dayFormatter = new Intl.DateTimeFormat("en", { weekday: "long" });
const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
});

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getPlannerWeek(offset = 0) {
  const monday = new Date();
  monday.setHours(0, 0, 0, 0);
  const daysSinceMonday = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - daysSinceMonday + offset * 7);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      key: dateKey(date),
      date,
      name: dayFormatter.format(date),
      shortName: dayFormatter.format(date).slice(0, 3),
      dateLabel: dateFormatter.format(date),
      isToday: dateKey(date) === dateKey(new Date()),
    };
  });
}

export function formatWeekRange(days) {
  if (!days.length) return "";
  const first = days[0].date;
  const last = days[days.length - 1].date;
  const month = new Intl.DateTimeFormat("en", { month: "short" });
  const year = new Intl.DateTimeFormat("en", { year: "numeric" });
  const firstLabel = `${month.format(first)} ${first.getDate()}`;
  const lastLabel =
    first.getMonth() === last.getMonth()
      ? `${last.getDate()}`
      : `${month.format(last)} ${last.getDate()}`;
  return `${firstLabel} – ${lastLabel}, ${year.format(last)}`;
}

function normalizedUnit(unit = "") {
  const value = unit.toLowerCase().replaceAll(".", "");
  if (["g", "gr", "gram", "grams", "gm"].includes(value)) return "g";
  if (["kg", "kgs", "kilogram", "kilograms"].includes(value)) return "kg";
  if (
    ["ml", "milliliter", "milliliters", "millilitre", "millilitres"].includes(
      value,
    )
  )
    return "ml";
  if (["l", "lt", "liter", "liters", "litre", "litres"].includes(value))
    return "l";
  if (["tsp", "teaspoon", "teaspoons"].includes(value)) return "tsp";
  if (["tbsp", "tablespoon", "tablespoons"].includes(value)) return "tbsp";
  if (["cup", "cups"].includes(value)) return "cups";
  return value;
}

export function summarizeQuantities(usages) {
  if (usages.length < 2) return "";
  const measures = usages.map(({ quantity }) => {
    const match = String(quantity)
      .trim()
      .match(/^(\d+(?:[.,]\d+)?)\s*([a-zA-Z.]*)$/);
    return match
      ? {
          amount: Number(match[1].replace(",", ".")),
          unit: normalizedUnit(match[2]),
        }
      : null;
  });
  if (measures.some((measure) => !measure)) return "";
  const unit = measures[0].unit;
  if (measures.some((measure) => measure.unit !== unit)) return "";
  const total = measures.reduce((sum, measure) => sum + measure.amount, 0);
  const printable = Number.isInteger(total)
    ? String(total)
    : String(Number(total.toFixed(2)));
  return `${printable}${unit ? ` ${unit}` : ""} total`;
}
