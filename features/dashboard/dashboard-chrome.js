"use client";

import { useEffect, useState } from "react";

export function Sidebar({
  remaining,
  completed,
  activeView,
  onViewChange,
  spaceName,
  displayName,
  onOpenDialog,
  onFocusAdd,
}) {
  const navigationItems = [
    { label: "Weekly plan", icon: "▦" },
    { label: "Find recipes", icon: "✳" },
    { label: "Shopping list", icon: "▤", count: remaining },
    { label: "Favorite recipes", icon: "♥" },
    { label: "In basket", icon: "◷", count: completed },
  ];

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-surface px-4 py-7 lg:flex">
      <a
        href="#home"
        className="mb-11 ml-1.5 flex items-center gap-2.5 font-display text-[21px] font-extrabold tracking-[-1px] text-forest dark:text-[#a6c1a8]"
      >
        <span className="grid h-7 w-7 rotate-[-8deg] place-items-center rounded-[9px_9px_9px_3px] bg-forest dark:bg-[#49614e]">
          <i className="block h-3.5 w-2.5 rotate-[8deg] rounded-[9px_2px_9px_2px] border-[1.7px] border-white" />
        </span>
        gather<span className="-ml-2 text-peach">.</span>
      </a>
      <p className="mb-2.5 px-2.5 text-[9px] font-bold tracking-[1.15px] text-muted">
        YOUR SPACE
      </p>
      <button
        type="button"
        onClick={() => onOpenDialog("space")}
        className="flex h-[54px] items-center gap-2.5 rounded-[10px] border border-line bg-canvas px-2 text-left"
      >
        <span className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-[#e9eee9] font-bold text-forest dark:bg-[#293b30]">
          {displayName.slice(0, 1).toUpperCase() || "M"}
        </span>
        <span className="grid flex-1 gap-0.5">
          <b className="text-xs font-semibold">{spaceName}</b>
          <small className="text-[10px] text-muted">Personal space</small>
        </span>
        <span className="text-muted">⌄</span>
      </button>
      <div className="mb-2.5 mt-8 flex items-center justify-between px-2.5 text-[9px] font-bold tracking-[1.15px] text-muted">
        <span>YOUR LIST</span>
        <button
          type="button"
          aria-label="Add a grocery item"
          onClick={onFocusAdd}
          className="text-lg font-normal"
        >
          ＋
        </button>
      </div>
      <nav aria-label="Main navigation" className="grid gap-1">
        {navigationItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onViewChange(item.label)}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-xs transition-colors ${activeView === item.label ? "bg-[#eff4ef] font-semibold text-forest dark:bg-[#26372c] dark:text-[#a6c1a8]" : "text-muted hover:bg-canvas hover:text-ink"}`}
          >
            <span className="w-[18px] text-center text-[17px]">
              {item.icon}
            </span>
            <span>{item.label}</span>
            {item.count !== undefined && (
              <small className="ml-auto rounded-md border border-line bg-surface px-1.5 py-0.5 text-[10px] text-muted">
                {item.count}
              </small>
            )}
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <div className="relative mb-4 rounded-[11px] bg-soft p-3.5">
          <span className="absolute right-3.5 top-3 text-[19px] text-peach">
            ✳
          </span>
          <b className="text-[11px] font-semibold">
            A little less to remember.
          </b>
          <p className="my-2 max-w-[170px] text-[10px] leading-[1.65] text-muted">
            Keep your shopping simple and your week a little smoother.
          </p>
          <button
            type="button"
            onClick={() => onOpenDialog("tips")}
            className="text-[10px] font-semibold text-forest dark:text-[#a6c1a8]"
          >
            Explore tips <span className="ml-1">↗</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => onOpenDialog("profile")}
          className="flex w-full items-center gap-2.5 border-t border-line px-1 pt-3 text-left"
        >
          <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#f3e5da] font-bold text-[#876854] dark:bg-[#43352b]">
            {displayName.slice(0, 1).toUpperCase() || "M"}
          </span>
          <span className="grid flex-1 gap-0.5">
            <b className="text-xs font-semibold">{displayName}</b>
            <small className="text-[10px] text-muted">Personal space</small>
          </span>
          <span className="text-base text-muted">···</span>
        </button>
      </div>
    </aside>
  );
}

export function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="grid h-8 w-8 place-items-center rounded-full border border-line bg-surface text-sm text-muted transition hover:bg-canvas hover:text-ink"
    >
      {isDark ? "☼" : "☾"}
    </button>
  );
}

const MOBILE_NAVIGATION_ITEMS = [
  "Weekly plan",
  "Find recipes",
  "Favorite recipes",
  "Shopping list",
  "In basket",
];

export function MobileNavigation({ activeView, onViewChange }) {
  return (
    <nav
      aria-label="Main navigation"
      className="flex shrink-0 gap-1 overflow-x-auto border-b border-line bg-surface px-3 py-1.5 lg:hidden"
    >
      {MOBILE_NAVIGATION_ITEMS.map((view) => (
        <button
          key={view}
          type="button"
          onClick={() => onViewChange(view)}
          className={`shrink-0 rounded-md px-3 py-2 text-[10px] ${activeView === view ? "bg-[#eff4ef] font-semibold text-forest dark:bg-[#26372c] dark:text-[#a6c1a8]" : "text-muted"}`}
        >
          {view}
        </button>
      ))}
    </nav>
  );
}

export function DashboardHeader({
  days,
  remaining,
  isDark,
  onToggleTheme,
  onOpenDialog,
  displayName,
}) {
  const todayName = days.find((day) => day.isToday)?.name || "Your week";
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-surface/90 px-4 sm:h-[62px] sm:px-7 xl:px-12">
      <div className="flex min-w-0 items-center gap-2 text-[10px] text-muted sm:text-[11px]">
        <span className="truncate">{todayName}</span>
        <span className="text-muted/50">·</span>
        <b className="hidden truncate font-medium text-muted sm:block">
          {remaining
            ? `${remaining} things left to pick up`
            : "Your list is all caught up"}
        </b>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        <button
          type="button"
          onClick={() => onOpenDialog("help")}
          className="text-[10px] text-muted hover:text-ink sm:text-[11px]"
        >
          Need a hand? <span className="ml-1 text-sage">↗</span>
        </button>
        <button
          type="button"
          aria-label="Edit profile"
          onClick={() => onOpenDialog("profile")}
          className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#f3e5da] text-[11px] font-bold text-[#82644e] dark:bg-[#43352b]"
        >
          {displayName.slice(0, 1).toUpperCase() || "M"}
        </button>
      </div>
    </header>
  );
}

export function DashboardIntroduction({ activeView, spaceName, weekLabel }) {
  const isRecipeView =
    activeView === "Find recipes" || activeView === "Favorite recipes";
  return (
    <>
      <div className="flex shrink-0 items-center gap-2.5 text-[10px] text-muted">
        <span>{spaceName}</span>
        <span>/</span>
        <b className="font-medium text-muted">{activeView}</b>
      </div>
      <section className="mb-3 mt-3 flex shrink-0 items-end justify-between gap-3 sm:mb-6 sm:mt-7">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-[1.2px] text-muted">
            <i className="h-1.5 w-1.5 rounded-full bg-sage" />
            {isRecipeView ? "FIND YOUR NEXT FAVORITE" : "YOUR WEEK, SORTED"}
          </div>
          <h1 className="mt-2 text-[clamp(1.55rem,2.4vw,2rem)] font-bold leading-tight tracking-[-.055em] text-ink">
            {activeView}
            <span className="ml-2 align-top text-[.65em] text-peach">✳</span>
          </h1>
          <p className="mt-1 max-w-[34rem] text-[clamp(.7rem,.85vw,.8rem)] leading-relaxed text-muted">
            {isRecipeView
              ? "Find a dish, choose its day, and add the ingredients to your weekly plan."
              : "A little planning goes a long way. What do you need this week?"}
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-2.5 rounded-[9px] border border-line bg-surface px-3 py-2 sm:flex">
          <span className="text-lg text-sage">▦</span>
          <span className="grid gap-0.5">
            <small className="text-[8px] tracking-[1px] text-muted">
              NEXT 7 DAYS
            </small>
            <b className="text-[11px] font-semibold">{weekLabel || "—"}</b>
          </span>
        </div>
      </section>
    </>
  );
}

const DIALOG_TITLES = {
  space: "Make it your space",
  profile: "Your profile",
  tips: "A few ways to make Gather work for you",
  help: "A little help",
};

function DialogActions({ onClose, label }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="mt-1 justify-self-end rounded-md bg-forest px-4 py-2 text-[10px] font-semibold text-white dark:bg-[#49614e]"
    >
      {label}
    </button>
  );
}

export function UtilityDialog({
  mode,
  onClose,
  spaceName,
  displayName,
  onSave,
}) {
  const [spaceDraft, setSpaceDraft] = useState(spaceName);
  const [nameDraft, setNameDraft] = useState(displayName);
  useEffect(() => {
    setSpaceDraft(spaceName);
    setNameDraft(displayName);
  }, [displayName, mode, spaceName]);
  if (!mode) return null;

  function submit(event) {
    event.preventDefault();
    onSave({
      spaceName: spaceDraft.trim() || "My home",
      displayName: nameDraft.trim() || "Me",
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="utility-dialog-title"
        className="w-full max-w-md rounded-2xl border border-line bg-surface p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-bold tracking-[1.2px] text-sage">
              GATHER · YOUR SPACE
            </p>
            <h2
              id="utility-dialog-title"
              className="mt-1 font-display text-lg font-bold"
            >
              {DIALOG_TITLES[mode]}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted hover:bg-canvas"
          >
            ×
          </button>
        </div>

        {(mode === "space" || mode === "profile") && (
          <form onSubmit={submit} className="grid gap-3">
            {mode === "space" && (
              <label className="grid gap-1.5 text-[10px] font-semibold text-muted">
                Space name
                <input
                  autoFocus
                  maxLength={30}
                  value={spaceDraft}
                  onChange={(event) => setSpaceDraft(event.target.value)}
                  className="h-10 rounded-md border border-line bg-canvas px-3 text-xs text-ink outline-none focus:border-sage"
                />
              </label>
            )}
            <label className="grid gap-1.5 text-[10px] font-semibold text-muted">
              Your name
              <input
                autoFocus={mode === "profile"}
                maxLength={30}
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                className="h-10 rounded-md border border-line bg-canvas px-3 text-xs text-ink outline-none focus:border-sage"
              />
            </label>
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-line px-3 py-2 text-[10px] text-muted"
              >
                Cancel
              </button>
              <button className="rounded-md bg-forest px-4 py-2 text-[10px] font-semibold text-white dark:bg-[#49614e]">
                Save changes
              </button>
            </div>
          </form>
        )}

        {mode === "tips" && (
          <div className="grid gap-3 text-[11px] leading-relaxed text-muted">
            <p>
              <b className="text-ink">Plan around meals.</b> Choose a day in
              Find recipes and schedule the dish with its measured ingredients.
            </p>
            <p>
              <b className="text-ink">Save recipes you love.</b> Add recipes to
              your favorites and plan them again any week.
            </p>
            <p>
              <b className="text-ink">Shop your way.</b> Switch between a
              combined ingredient list and a breakdown by meal.
            </p>
            <DialogActions onClose={onClose} label="Sounds good" />
          </div>
        )}

        {mode === "help" && (
          <div className="grid gap-3 text-[11px] leading-relaxed text-muted">
            <p>
              <b className="text-ink">Add items:</b> enter a name, quantity, and
              aisle, then choose Add item.
            </p>
            <p>
              <b className="text-ink">Keep your list:</b> changes are saved in
              this browser. They won’t sync to another device yet.
            </p>
            <p>
              <b className="text-ink">Recipe ingredients:</b> Find recipes, pick
              a day and meal, and schedule it. Its ingredients appear in the
              shopping list automatically.
            </p>
            <DialogActions onClose={onClose} label="Got it" />
          </div>
        )}
      </section>
    </div>
  );
}
