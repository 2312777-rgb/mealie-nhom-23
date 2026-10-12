import { expect, test, type Page } from "@playwright/test";

const group = encodeURIComponent(process.env.MEALIE_TEST_GROUP_SLUG ?? "home");
const scenarios = [
  { id: "VR01", name: "recipe-finder", path: `/g/${group}/recipes/finder`, ready: /No recipes found/ },
  { id: "VR02", name: "recipe-timeline", path: `/g/${group}/recipes/timeline`, ready: /QA Recipe 01/ },
  { id: "VR03", name: "recipe-categories", path: `/g/${group}/recipes/categories`, ready: /QA Breakfast/ },
  { id: "VR04", name: "meal-planner", path: "/household/mealplan/planner/view", ready: /QA Recipe/ },
  { id: "VR05", name: "shopping-lists", path: "/shopping-lists", ready: /QA Weekly Shopping/ },
  { id: "VR06", name: "profile-dashboard", path: "/user/profile", ready: /Welcome/i },
  { id: "VR07", name: "group-food-data", path: "/group/data/foods", ready: /QA Food 01/ },
  { id: "VR08", name: "meal-plan-settings", path: "/household/mealplan/settings", ready: /Meal Plan|Recipe Rules/i },
];

async function stabilise(page: Page): Promise<void> {
  // Let Vue remove its enter/from classes before disabling transitions.
  await expect(page.locator(".spin-enter-active, .spin-enter-from, .spin-enter-to")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addStyleTag({ content: `
    *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
  ` });
  await expect(page.locator(".v-skeleton-loader:visible")).toHaveCount(0);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.images).map(image => image.decode().catch(() => undefined)));
  });
}

for (const scenario of scenarios) {
  test(`${scenario.id} ${scenario.name}`, async ({ page }, testInfo) => {
    const failures: string[] = [];
    page.on("pageerror", error => failures.push(`JavaScript: ${error.message}`));
    page.on("response", response => {
      const path = new URL(response.url()).pathname;
      if (path.startsWith("/api/") && response.status() >= 400) failures.push(`HTTP ${response.status()}: ${path}`);
    });
    page.on("requestfailed", request => {
      const path = new URL(request.url()).pathname;
      if (path.startsWith("/api/") && request.failure()?.errorText !== "net::ERR_ABORTED") failures.push(`Network: ${path}`);
    });
    // Change Date without freezing timers or the authentication refresh loop.
    await page.clock.setFixedTime(new Date(process.env.MEALIE_FIXED_DATE ?? "2026-10-12T12:00:00Z"));
    const response = await page.goto(scenario.path);
    expect(response?.ok(), "Page navigation must succeed").toBeTruthy();
    await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, "")).toBe(scenario.path);
    const main = page.locator("main");
    await expect(main).toBeVisible();
    await expect(main.getByText(scenario.ready).first()).toBeVisible();
    await stabilise(page);
    await expect(main.getByText(scenario.ready).first()).toBeVisible();
    await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, "")).toBe(scenario.path);
    // Controlled demonstrations affect only this browser page, never upstream files.
    if (process.env.MEALIE_DEMO_MODE === "regression") {
      await page.addStyleTag({ content: "main { transform: translateX(48px) !important; }" });
    } else if (process.env.MEALIE_DEMO_MODE === "intentional") {
      await main.evaluate(element => {
        (element as HTMLElement).style.setProperty("transition", "none", "important");
        (element as HTMLElement).style.setProperty("background-color", "#1e40af", "important");
      });
      await expect.poll(() => main.evaluate(element => getComputedStyle(element).backgroundColor)).toBe("rgb(30, 64, 175)");
    }
    expect(failures, "API and JavaScript errors").toEqual([]);
    await testInfo.attach("scenario", {
      body: JSON.stringify({ id: scenario.id, path: scenario.path, viewport: page.viewportSize(), fixedDate: process.env.MEALIE_FIXED_DATE ?? "2026-10-12T12:00:00Z" }),
      contentType: "application/json",
    });
    await expect(page).toHaveScreenshot(`${scenario.id}-${scenario.name}.png`, {
      fullPage: true, animations: "disabled", maxDiffPixelRatio: 0.01, threshold: 0.2,
    });
    expect(failures, "Errors during capture").toEqual([]);
    await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, "")).toBe(scenario.path);
  });
}
