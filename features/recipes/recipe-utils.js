export function categorizeIngredient(name) {
  const value = name.toLowerCase();
  if (
    /chicken|beef|pork|lamb|bacon|sausage|fish|salmon|shrimp|prawn|tuna|turkey/.test(
      value,
    )
  )
    return "Meat & fish";
  if (/milk|cheese|butter|cream|yogurt|yoghurt|egg/.test(value))
    return "Dairy & eggs";
  if (/bread|bun|baguette|tortilla|pita/.test(value)) return "Bakery";
  if (
    /tomato|onion|garlic|pepper|spinach|carrot|potato|avocado|lettuce|basil|parsley|coriander|lemon|lime|apple|mushroom|broccoli|zucchini|courgette/.test(
      value,
    )
  )
    return "Produce";
  if (/chocolate|crisps|chips|cracker|cookie|biscuit|nuts/.test(value))
    return "Snacks";
  return "Pantry";
}

export function normalizeRecipe(recipe) {
  if (Array.isArray(recipe.ingredients)) return recipe;

  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const name = recipe[`strIngredient${index + 1}`]?.trim();
    const quantity = recipe[`strMeasure${index + 1}`]?.trim();
    return name
      ? {
          name,
          quantity: quantity || "To taste",
          category: categorizeIngredient(name),
        }
      : null;
  }).filter(Boolean);

  return {
    mealId: recipe.idMeal,
    name: recipe.strMeal,
    image: recipe.strMealThumb,
    category: recipe.strCategory,
    area: recipe.strArea,
    source: recipe.strSource,
    youtube: recipe.strYoutube,
    instructions: recipe.strInstructions,
    ingredients,
  };
}
