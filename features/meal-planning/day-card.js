"use client";

export function DayCard({
  day,
  meals,
  favoriteIds,
  onAddMeal,
  onRemoveMeal,
  onToggleFavoriteRecipe,
  onViewRecipe,
  compact = false,
}) {
  return (
    <article
      className={`flex ${compact ? "min-h-[270px]" : "min-h-[260px] 2xl:min-h-[320px]"} flex-col overflow-hidden rounded-2xl border bg-surface shadow-[0_5px_18px_rgba(39,55,41,.035)] ${day.isToday ? "border-sage/70 ring-1 ring-sage/20" : "border-line"}`}
    >
      <header className="flex shrink-0 items-center justify-between border-b border-line px-3 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-[10px] font-bold ${day.isToday ? "bg-forest text-white dark:bg-[#49614e]" : "bg-canvas text-muted"}`}
          >
            {day.date.getDate()}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-bold">
              {day.name}
            </span>
            <span className="block text-[9px] text-muted">
              {day.dateLabel}
              {day.isToday ? " · Today" : ""}
            </span>
          </span>
        </div>
        <span className="ml-1 rounded-full bg-canvas px-2 py-1 text-[9px] text-muted">
          {meals.length}/3
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-2">
        {meals.length ? (
          meals.map((meal) => {
            const isFavorite = favoriteIds.has(meal.mealId);
            return (
              <div
                key={meal.id}
                className="group flex min-w-0 items-center gap-1.5 rounded-xl bg-canvas p-1.5"
              >
                <button
                  type="button"
                  onClick={() => onViewRecipe(meal)}
                  aria-label={`View ${meal.name} recipe`}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-lg text-left outline-none transition hover:text-forest focus-visible:ring-2 focus-visible:ring-sage dark:hover:text-[#a6c1a8]"
                >
                  <span
                    role="img"
                    aria-label={
                      meal.image
                        ? `Photo of ${meal.name}`
                        : `Meal: ${meal.name}`
                    }
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cover bg-center ${meal.image ? "" : "bg-soft text-sm"}`}
                    style={{
                      backgroundImage: meal.image
                        ? `url("${meal.image}")`
                        : "none",
                    }}
                  >
                    {meal.image ? null : "🍽️"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-0.5 block text-[8px] font-bold uppercase tracking-[.7px] text-sage">
                      {meal.slot || "Lunch"}
                    </span>
                    <span className="block truncate text-[10px] font-semibold leading-tight">
                      {meal.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[8px] text-muted">
                      {meal.ingredients.length} ingredients · View recipe
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={`${isFavorite ? "Remove" : "Add"} ${meal.name} ${isFavorite ? "from" : "to"} favorite recipes`}
                  aria-pressed={isFavorite}
                  onClick={() => onToggleFavoriteRecipe(meal)}
                  className={`grid h-7 w-6 shrink-0 place-items-center text-[13px] transition ${isFavorite ? "text-[#d58f81]" : "text-muted opacity-100 hover:text-[#d58f81] sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"}`}
                >
                  {isFavorite ? "♥" : "♡"}
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${meal.name} from ${day.name}`}
                  onClick={() => onRemoveMeal(meal.id)}
                  className="grid h-7 w-5 shrink-0 place-items-center text-base text-muted opacity-100 transition hover:text-[#bd8182] sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                >
                  ×
                </button>
              </div>
            );
          })
        ) : (
          <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-line/80 px-2 text-center text-[9px] text-muted">
            A little room for something good
          </div>
        )}
        <button
          type="button"
          disabled={meals.length >= 3}
          onClick={() => onAddMeal(day.key)}
          className="mt-auto flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-dashed border-line text-[9px] font-semibold text-muted transition hover:border-sage hover:bg-canvas hover:text-forest disabled:cursor-default disabled:opacity-40 dark:hover:text-[#a6c1a8]"
        >
          ＋ Add a meal
        </button>
      </div>
    </article>
  );
}
