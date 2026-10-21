const demoRecipes = [
  {
    mealId: "gather-demo-lemon-chicken",
    name: "Lemon herb chicken bowls",
    category: "Balanced dinner",
    area: "Gather kitchen",
    slot: "Lunch",
    instructions:
      "Cook the rice according to the package directions. Season the chicken with salt, pepper, and half the lemon juice, then sear in a hot pan until cooked through. Toss the cucumber and tomatoes with olive oil and the remaining lemon. Serve everything with yogurt and fresh parsley.",
    ingredients: [
      { name: "Chicken breast", quantity: "400 g", category: "Meat & fish" },
      { name: "Rice", quantity: "200 g", category: "Pantry" },
      { name: "Cucumber", quantity: "1", category: "Produce" },
      { name: "Cherry tomatoes", quantity: "150 g", category: "Produce" },
      { name: "Greek yogurt", quantity: "120 g", category: "Dairy & eggs" },
      { name: "Lemon", quantity: "1", category: "Produce" },
      { name: "Fresh parsley", quantity: "10 g", category: "Produce" },
      { name: "Olive oil", quantity: "1 tbsp", category: "Pantry" },
      { name: "Salt & black pepper", quantity: "To taste", category: "Pantry" },
    ],
  },
  {
    mealId: "gather-demo-coconut-curry",
    name: "Coconut chickpea curry",
    category: "One-pot favorite",
    area: "Gather kitchen",
    slot: "Dinner",
    instructions:
      "Soften the onion in a little oil. Add the garlic, curry powder, and tomato paste and cook for one minute. Stir in the chickpeas and coconut milk, then simmer for 15 minutes. Finish with lime juice and spinach; serve with warm rice.",
    ingredients: [
      { name: "Chickpeas", quantity: "2 cans", category: "Pantry" },
      { name: "Coconut milk", quantity: "400 ml", category: "Pantry" },
      { name: "Yellow onion", quantity: "1", category: "Produce" },
      { name: "Garlic", quantity: "2 cloves", category: "Produce" },
      { name: "Curry powder", quantity: "2 tbsp", category: "Pantry" },
      { name: "Baby spinach", quantity: "100 g", category: "Produce" },
      { name: "Lime", quantity: "1", category: "Produce" },
      { name: "Rice", quantity: "200 g", category: "Pantry" },
      { name: "Tomato paste", quantity: "1 tbsp", category: "Pantry" },
      { name: "Olive oil", quantity: "1 tbsp", category: "Pantry" },
    ],
  },
  {
    mealId: "gather-demo-tomato-pasta",
    name: "Roasted tomato pasta",
    category: "Easy midweek meal",
    area: "Gather kitchen",
    slot: "Dinner",
    instructions:
      "Roast the tomatoes with olive oil, salt, and pepper at 220°C for about 20 minutes. Meanwhile, cook the pasta until just tender and reserve a mug of pasta water. Toss the pasta with the roasted tomatoes, a splash of pasta water, basil, and grated parmesan.",
    ingredients: [
      { name: "Pasta", quantity: "250 g", category: "Pantry" },
      { name: "Cherry tomatoes", quantity: "300 g", category: "Produce" },
      { name: "Parmesan", quantity: "40 g", category: "Dairy & eggs" },
      { name: "Fresh basil", quantity: "15 g", category: "Produce" },
      { name: "Olive oil", quantity: "2 tbsp", category: "Pantry" },
      { name: "Salt & black pepper", quantity: "To taste", category: "Pantry" },
    ],
  },
  {
    mealId: "gather-demo-salmon-tray",
    name: "Salmon & greens tray bake",
    category: "Simple weekend supper",
    area: "Gather kitchen",
    slot: "Lunch",
    instructions:
      "Heat the oven to 200°C. Cut the potatoes into small chunks, toss with olive oil, salt, and pepper, and roast for 20 minutes. Add the salmon and broccoli to the tray, season with lemon zest, and roast for another 12–15 minutes until the salmon flakes easily.",
    ingredients: [
      { name: "Salmon fillets", quantity: "2", category: "Meat & fish" },
      { name: "Baby potatoes", quantity: "400 g", category: "Produce" },
      { name: "Broccoli", quantity: "1 head", category: "Produce" },
      { name: "Lemon", quantity: "1", category: "Produce" },
      { name: "Olive oil", quantity: "1 tbsp", category: "Pantry" },
      { name: "Salt & black pepper", quantity: "To taste", category: "Pantry" },
    ],
  },
];

export function createDemoWeek(days) {
  const mealDays = [days[0], days[1], days[3], days[5]];
  return demoRecipes.map((recipe, index) => ({
    ...recipe,
    dayKey: mealDays[index].key,
    ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient })),
  }));
}
