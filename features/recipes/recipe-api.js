async function fetchRecipes(params, { signal } = {}) {
  const search = new URLSearchParams(params);
  const response = await fetch(`/api/recipes?${search}`, { signal });
  if (!response.ok)
    throw new Error("Recipe service is temporarily unavailable.");

  const data = await response.json();
  return Array.isArray(data.meals) ? data.meals : [];
}

export function searchRecipes(query, options) {
  return fetchRecipes({ q: query }, options);
}

export async function getRecipeDetails(mealId, options) {
  const recipes = await fetchRecipes({ id: mealId }, options);
  return recipes[0] || null;
}
