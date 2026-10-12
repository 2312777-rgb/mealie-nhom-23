import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";

const base = new URL(process.env.MEALIE_API_URL ?? process.env.MEALIE_BASE_URL ?? "http://127.0.0.1:19000");
if (!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) throw new Error("Seeding is restricted to localhost.");
if (process.env.MEALIE_ALLOW_SEED !== "true") throw new Error("Set MEALIE_ALLOW_SEED=true for a dedicated QA account.");
const email = process.env.MEALIE_TEST_EMAIL;
const password = process.env.MEALIE_TEST_PASSWORD;
if (!email || !password) throw new Error("Test credentials are required.");
const login = await fetch(new URL("/api/auth/token", base), {
  method: "POST", body: new URLSearchParams({ username: email, password }),
});
if (!login.ok) throw new Error(`Authentication failed: ${login.status}`);
const { access_token: token } = await login.json();
async function api(path, method = "GET", body) {
  const response = await fetch(new URL(`/api${path}`, base), {
    method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`${method} ${path}: HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
}
async function items(path) {
  const result = await api(`${path}${path.includes("?") ? "&" : "?"}perPage=-1`);
  return Array.isArray(result) ? result : result.items;
}
async function ensureNamed(path, names) {
  const existing = await items(path);
  const result = [];
  for (const name of names) result.push(existing.find(item => item.name === name) ?? await api(path, "POST", { name }));
  return result;
}
const user = await api("/users/self");
if (!user.groupId || !user.householdId) throw new Error("The QA user must have a group and household.");
const categories = await ensureNamed("/organizers/categories", ["QA Breakfast", "QA Lunch", "QA Dinner"]);
await ensureNamed("/foods", Array.from({ length: 10 }, (_, i) => `QA Food ${String(i + 1).padStart(2, "0")}`));
const existingRecipes = await items("/recipes");
const recipes = [];
for (let i = 0; i < 10; i++) {
  const name = `QA Recipe ${String(i + 1).padStart(2, "0")}`;
  const found = existingRecipes.find(item => item.name === name);
  const slug = found?.slug ?? await api("/recipes", "POST", { name });
  const recipe = await api(`/recipes/${slug}`);
  recipe.description = `Deterministic visual test recipe ${i + 1}`;
  recipe.dateAdded = "2026-10-12";
  recipe.recipeCategory = [categories[i % categories.length]];
  await api(`/recipes/${slug}`, "PUT", recipe);
  recipes.push(recipe);
}
// With a single list Mealie redirects to its detail route; two lists keep VR05 on the index.
const lists = await ensureNamed("/households/shopping/lists", ["QA Weekly Shopping", "QA Pantry Shopping"]);
const fixed = new Date(process.env.MEALIE_FIXED_DATE ?? "2026-10-12T12:00:00Z");
if (Number.isNaN(fixed.valueOf())) throw new Error("Invalid MEALIE_FIXED_DATE");
fixed.setUTCDate(fixed.getUTCDate() - (fixed.getUTCDay() + 6) % 7);
const start = fixed.toISOString().slice(0, 10);
const endDate = new Date(fixed); endDate.setUTCDate(endDate.getUTCDate() + 6);
const plans = await items(`/households/mealplans?start_date=${start}&end_date=${endDate.toISOString().slice(0, 10)}`);
for (let i = 0; i < 7; i++) {
  const date = new Date(fixed); date.setUTCDate(date.getUTCDate() + i);
  const day = date.toISOString().slice(0, 10);
  if (!plans.some(plan => plan.date === day && plan.recipeId === recipes[i].id && plan.entryType === "dinner")) {
    await api("/households/mealplans", "POST", { date: day, entryType: "dinner", recipeId: recipes[i].id });
  }
}
await mkdir("test-results", { recursive: true });
const manifest = { seedVersion: 1, createdAt: new Date().toISOString(), recipes: recipes.length, categories: categories.length, foods: 10, shoppingLists: lists.length, mealPlanDays: 7, fixedWeekStart: start };
await writeFile("test-results/seed-manifest.json", JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest, null, 2));
