import { expect, test } from "@playwright/test";

const groupSlug = process.env.MEALIE_TEST_GROUP_SLUG ?? "home";

async function stabilise(page: import("@playwright/test").Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addStyleTag({ content: `
    *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
    [data-visual-ignore], .v-progress-linear, .v-skeleton-loader { visibility: hidden !important; }
  ` });
  await page.waitForLoadState("networkidle");
  await page.locator("body").waitFor({ state: "visible" });
}

async function assertPageSnapshot(page: import("@playwright/test").Page, path: string, snapshot: string) {
  await page.goto(path);
  await stabilise(page);
  await expect(page).toHaveScreenshot(snapshot, { fullPage: true, animations: "disabled", maxDiffPixelRatio: 0.01 });
}

test.describe("Mealie visual regression suite", () => {
  test("VR01 recipe finder", async ({ page }) => assertPageSnapshot(page, `/g/${groupSlug}/recipes/finder`, "VR01-recipe-finder.png"));
  test("VR02 recipe timeline", async ({ page }) => assertPageSnapshot(page, `/g/${groupSlug}/recipes/timeline`, "VR02-recipe-timeline.png"));
  test("VR03 recipe categories", async ({ page }) => assertPageSnapshot(page, `/g/${groupSlug}/recipes/categories`, "VR03-recipe-categories.png"));
  test("VR04 meal planner", async ({ page }) => assertPageSnapshot(page, "/household/mealplan/planner/view", "VR04-meal-planner.png"));
  test("VR05 shopping lists", async ({ page }) => assertPageSnapshot(page, "/shopping-lists", "VR05-shopping-lists.png"));
  test("VR06 profile dashboard", async ({ page }) => assertPageSnapshot(page, "/user/profile", "VR06-profile-dashboard.png"));
  test("VR07 group food data", async ({ page }) => assertPageSnapshot(page, "/group/data/foods", "VR07-group-food-data.png"));
  test("VR08 meal plan settings", async ({ page }) => assertPageSnapshot(page, "/household/mealplan/settings", "VR08-meal-plan-settings.png"));
});
