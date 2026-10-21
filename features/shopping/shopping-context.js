"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

const ShoppingContext = createContext(null);
const STORAGE_KEY = "gather-weekly-meal-plan-v1";
const LEGACY_STORAGE_KEY = "gather-shopping-list-v2";
const initialState = { items: [], meals: [], favoriteRecipes: [] };

function reducer(state, action) {
  switch (action.type) {
    case "item/add":
      return { ...state, items: [action.item, ...state.items] };
    case "item/toggle":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, checked: !item.checked } : item,
        ),
      };
    case "item/delete":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };
    case "items/clear-completed":
      return { ...state, items: state.items.filter((item) => !item.checked) };
    case "meal/add":
      return { ...state, meals: [action.meal, ...state.meals] };
    case "meals/add-many":
      return { ...state, meals: [...action.meals, ...state.meals] };
    case "meal/remove":
      return {
        ...state,
        meals: state.meals.filter((meal) => meal.id !== action.id),
      };
    case "meal/remove-ingredient":
      return {
        ...state,
        meals: state.meals.map((meal) =>
          meal.id === action.mealId
            ? {
                ...meal,
                ingredients: meal.ingredients.filter(
                  (ingredient) => ingredient.id !== action.ingredientId,
                ),
              }
            : meal,
        ),
      };
    case "meal/toggle-ingredient":
      return {
        ...state,
        meals: state.meals.map((meal) =>
          meal.id !== action.mealId
            ? meal
            : {
                ...meal,
                ingredients: meal.ingredients.map((ingredient) =>
                  ingredient.id === action.ingredientId
                    ? { ...ingredient, checked: !ingredient.checked }
                    : ingredient,
                ),
              },
        ),
      };
    case "recipe/favorite": {
      const exists = state.favoriteRecipes.some(
        (recipe) => recipe.mealId === action.recipe.mealId,
      );
      return {
        ...state,
        favoriteRecipes: exists
          ? state.favoriteRecipes.filter(
              (recipe) => recipe.mealId !== action.recipe.mealId,
            )
          : [action.recipe, ...state.favoriteRecipes],
      };
    }
    case "hydrate":
      return action.state;
    default:
      return state;
  }
}

function validSavedState(value) {
  if (
    !value ||
    typeof value !== "object" ||
    !Array.isArray(value.items) ||
    !Array.isArray(value.meals)
  ) {
    return null;
  }

  return {
    items: value.items
      .filter((item) => !String(item.id).startsWith("starter-"))
      .map(({ favorite, ...item }) => item),
    meals: value.meals,
    favoriteRecipes: Array.isArray(value.favoriteRecipes)
      ? value.favoriteRecipes
      : [],
  };
}

function prepareMeal(meal) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return {
    ...meal,
    id,
    ingredients: meal.ingredients.map((ingredient, index) => ({
      ...ingredient,
      id: `${id}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      checked: false,
    })),
  };
}

export function ShoppingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedPlan = window.localStorage.getItem(STORAGE_KEY);
      const savedList = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (savedPlan) {
        const hydrated = validSavedState(JSON.parse(savedPlan));
        if (hydrated) dispatch({ type: "hydrate", state: hydrated });
      } else if (savedList) {
        const oldItems = JSON.parse(savedList);
        if (Array.isArray(oldItems)) {
          dispatch({
            type: "hydrate",
            state: {
              items: oldItems
                .filter((item) => !String(item.id).startsWith("starter-"))
                .map(({ favorite, ...item }) => item),
              meals: [],
              favoriteRecipes: [],
            },
          });
        }
      }
    } catch {
      // A blocked or malformed storage value falls back to an empty plan.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage may be disabled; the in-memory plan remains usable.
    }
  }, [state, ready]);

  const addItem = useCallback((item) => {
    dispatch({
      type: "item/add",
      item: {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        checked: false,
      },
    });
  }, []);
  const toggleItem = useCallback(
    (id) => dispatch({ type: "item/toggle", id }),
    [],
  );
  const deleteItem = useCallback(
    (id) => dispatch({ type: "item/delete", id }),
    [],
  );
  const clearCompleted = useCallback(
    () => dispatch({ type: "items/clear-completed" }),
    [],
  );
  const addMeal = useCallback(
    (meal, dayKey) =>
      dispatch({ type: "meal/add", meal: prepareMeal({ ...meal, dayKey }) }),
    [],
  );
  const addMeals = useCallback(
    (meals) =>
      dispatch({ type: "meals/add-many", meals: meals.map(prepareMeal) }),
    [],
  );
  const removeMeal = useCallback(
    (id) => dispatch({ type: "meal/remove", id }),
    [],
  );
  const removeMealIngredient = useCallback(
    (mealId, ingredientId) =>
      dispatch({ type: "meal/remove-ingredient", mealId, ingredientId }),
    [],
  );
  const toggleMealIngredient = useCallback(
    (mealId, ingredientId) =>
      dispatch({ type: "meal/toggle-ingredient", mealId, ingredientId }),
    [],
  );
  const toggleFavoriteRecipe = useCallback(
    (recipe) => dispatch({ type: "recipe/favorite", recipe }),
    [],
  );

  const value = useMemo(
    () => ({
      items: state.items,
      meals: state.meals,
      favoriteRecipes: state.favoriteRecipes,
      addItem,
      toggleItem,
      deleteItem,
      clearCompleted,
      addMeal,
      addMeals,
      removeMeal,
      removeMealIngredient,
      toggleMealIngredient,
      toggleFavoriteRecipe,
    }),
    [
      state,
      addItem,
      toggleItem,
      deleteItem,
      clearCompleted,
      addMeal,
      addMeals,
      removeMeal,
      removeMealIngredient,
      toggleMealIngredient,
      toggleFavoriteRecipe,
    ],
  );

  return (
    <ShoppingContext.Provider value={value}>
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShopping() {
  const context = useContext(ShoppingContext);
  if (!context)
    throw new Error("useShopping must be used within a ShoppingProvider");
  return context;
}
