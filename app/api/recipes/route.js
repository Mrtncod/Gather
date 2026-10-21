import { NextResponse } from "next/server";

const RECIPE_API_URL = "https://www.themealdb.com/api/json/v1/1/";

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams;
  const mealId = searchParams.get("id")?.trim();
  const query = searchParams.get("q")?.trim();
  if (mealId && !/^\d+$/.test(mealId)) return NextResponse.json({ error: "Invalid recipe id." }, { status: 400 });
  if (!mealId && !query) return NextResponse.json({ meals: [] });

  try {
    const endpoint = mealId
      ? `lookup.php?i=${encodeURIComponent(mealId)}`
      : `search.php?s=${encodeURIComponent(query)}`;
    const response = await fetch(`${RECIPE_API_URL}${endpoint}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return NextResponse.json({ error: "Recipe search is unavailable." }, { status: 502 });
    }
    const data = await response.json();
    return NextResponse.json({ meals: Array.isArray(data.meals) ? data.meals : [] });
  } catch {
    return NextResponse.json({ error: "Could not connect to the recipe service." }, { status: 502 });
  }
}
