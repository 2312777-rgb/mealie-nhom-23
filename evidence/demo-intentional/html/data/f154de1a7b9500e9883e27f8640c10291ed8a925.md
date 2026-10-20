# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.ts >> VR01 recipe-finder
- Location: tests\visual.spec.ts:30:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  981704 pixels (ratio 0.76 of all image pixels) are different.

  Snapshot: VR01-recipe-finder.png

Call log:
  - Expect "toHaveScreenshot(VR01-recipe-finder.png)" with timeout 20000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 981704 pixels (ratio 0.76 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 981704 pixels (ratio 0.76 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - banner [ref=e5]:
      - generic [ref=e6]:
        - button [ref=e7] [cursor=pointer]
        - link [ref=e12] [cursor=pointer]:
          - /url: /g/r02-k10-qa-1
          - button [ref=e13]
        - generic [ref=e18]: Mealie
        - generic [ref=e23]:
          - textbox "Press '/'" [ref=e31]
          - alert [ref=e32]
        - button "Logout" [ref=e34] [cursor=pointer]
    - navigation [ref=e39]:
      - generic [ref=e40]:
        - link "10305e48-8e53-4ec6-b5b2-94e4924d0068 Visual QA Team Favorite Recipes" [ref=e41] [cursor=pointer]:
          - /url: /user/profile
          - generic [ref=e43]:
            - img "10305e48-8e53-4ec6-b5b2-94e4924d0068" [ref=e45]:
              - img "10305e48-8e53-4ec6-b5b2-94e4924d0068" [ref=e46]
            - generic [ref=e47]:
              - generic [ref=e48]: Visual QA Team
              - link "Favorite Recipes" [ref=e50]:
                - /url: /user/10305e48-8e53-4ec6-b5b2-94e4924d0068/favorites
        - separator [ref=e55]
        - button "Create" [ref=e56] [cursor=pointer]
        - list [ref=e61]:
          - link "Recipes" [ref=e63] [cursor=pointer]:
            - /url: /g/r02-k10-qa-1
          - link "Recipe Finder" [ref=e71] [cursor=pointer]:
            - /url: /g/r02-k10-qa-1/recipes/finder
          - link "Meal Planner" [ref=e79] [cursor=pointer]:
            - /url: /household/mealplan/planner/view
          - link "Shopping Lists" [ref=e87] [cursor=pointer]:
            - /url: /shopping-lists
          - link "Timeline" [ref=e95] [cursor=pointer]:
            - /url: /g/r02-k10-qa-1/recipes/timeline
          - link "Cookbooks" [ref=e103] [cursor=pointer]:
            - /url: /g/r02-k10-qa-1/cookbooks
          - listitem [ref=e112] [cursor=pointer]:
            - generic [ref=e117]: Organizers
      - list [ref=e124]:
        - listitem [ref=e125] [cursor=pointer]:
          - status "Badge" [ref=e132]: "1"
          - generic [ref=e133]: Announcements
        - listitem [ref=e135] [cursor=pointer]:
          - generic [ref=e140]: Settings
    - main [ref=e142]:
      - generic [ref=e144]:
        - generic [ref=e145]:
          - generic [ref=e146]:
            - heading "Recipe Finder" [level=2] [ref=e149]
            - heading [level=3]
          - generic [ref=e150]: Search for recipes based on ingredients you have on hand. You can also filter by tools you have available, and set a maximum number of missing ingredients or tools.
          - separator [ref=e151]
        - generic [ref=e153]:
          - generic [ref=e155]:
            - generic [ref=e157]:
              - button "Foods" [ref=e161] [cursor=pointer]
              - button "Tools" [ref=e169] [cursor=pointer]
              - button "Other Filters" [ref=e177] [cursor=pointer]
            - button "Settings" [ref=e184] [cursor=pointer]
            - separator [ref=e191]
            - generic [ref=e192]:
              - generic [ref=e193]: Selected Ingredients
              - generic [ref=e194]: No ingredients selected
          - generic [ref=e199]:
            - generic [ref=e200]: No recipes found
            - generic [ref=e201]: Try adding more ingredients to your search or adjusting your filters
  - generic:
    - tooltip
```

# Test source

```ts
  1  | import { expect, test, type Page } from "@playwright/test";
  2  | 
  3  | const group = encodeURIComponent(process.env.MEALIE_TEST_GROUP_SLUG ?? "home");
  4  | const scenarios = [
  5  |   { id: "VR01", name: "recipe-finder", path: `/g/${group}/recipes/finder`, ready: /No recipes found/ },
  6  |   { id: "VR02", name: "recipe-timeline", path: `/g/${group}/recipes/timeline`, ready: /QA Recipe 01/ },
  7  |   { id: "VR03", name: "recipe-categories", path: `/g/${group}/recipes/categories`, ready: /QA Breakfast/ },
  8  |   { id: "VR04", name: "meal-planner", path: "/household/mealplan/planner/view", ready: /QA Recipe/ },
  9  |   { id: "VR05", name: "shopping-lists", path: "/shopping-lists", ready: /QA Weekly Shopping/ },
  10 |   { id: "VR06", name: "profile-dashboard", path: "/user/profile", ready: /Welcome/i },
  11 |   { id: "VR07", name: "group-food-data", path: "/group/data/foods", ready: /QA Food 01/ },
  12 |   { id: "VR08", name: "meal-plan-settings", path: "/household/mealplan/settings", ready: /Meal Plan|Recipe Rules/i },
  13 | ];
  14 | 
  15 | async function stabilise(page: Page): Promise<void> {
  16 |   // Let Vue remove its enter/from classes before disabling transitions.
  17 |   await expect(page.locator(".spin-enter-active, .spin-enter-from, .spin-enter-to")).toHaveCount(0);
  18 |   await page.emulateMedia({ reducedMotion: "reduce" });
  19 |   await page.addStyleTag({ content: `
  20 |     *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
  21 |   ` });
  22 |   await expect(page.locator(".v-skeleton-loader:visible")).toHaveCount(0);
  23 |   await page.evaluate(async () => {
  24 |     await document.fonts.ready;
  25 |     await Promise.all(Array.from(document.images).map(image => image.decode().catch(() => undefined)));
  26 |   });
  27 | }
  28 | 
  29 | for (const scenario of scenarios) {
  30 |   test(`${scenario.id} ${scenario.name}`, async ({ page }, testInfo) => {
  31 |     const failures: string[] = [];
  32 |     page.on("pageerror", error => failures.push(`JavaScript: ${error.message}`));
  33 |     page.on("response", response => {
  34 |       const path = new URL(response.url()).pathname;
  35 |       if (path.startsWith("/api/") && response.status() >= 400) failures.push(`HTTP ${response.status()}: ${path}`);
  36 |     });
  37 |     page.on("requestfailed", request => {
  38 |       const path = new URL(request.url()).pathname;
  39 |       if (path.startsWith("/api/") && request.failure()?.errorText !== "net::ERR_ABORTED") failures.push(`Network: ${path}`);
  40 |     });
  41 |     // Change Date without freezing timers or the authentication refresh loop.
  42 |     await page.clock.setFixedTime(new Date(process.env.MEALIE_FIXED_DATE ?? "2026-10-12T12:00:00Z"));
  43 |     const response = await page.goto(scenario.path);
  44 |     expect(response?.ok(), "Page navigation must succeed").toBeTruthy();
  45 |     await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, "")).toBe(scenario.path);
  46 |     const main = page.locator("main");
  47 |     await expect(main).toBeVisible();
  48 |     await expect(main.getByText(scenario.ready).first()).toBeVisible();
  49 |     await stabilise(page);
  50 |     await expect(main.getByText(scenario.ready).first()).toBeVisible();
  51 |     await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, "")).toBe(scenario.path);
  52 |     // Controlled demonstrations affect only this browser page, never upstream files.
  53 |     if (process.env.MEALIE_DEMO_MODE === "regression") {
  54 |       await page.addStyleTag({ content: "main { transform: translateX(48px) !important; }" });
  55 |     } else if (process.env.MEALIE_DEMO_MODE === "intentional") {
  56 |       await main.evaluate(element => {
  57 |         (element as HTMLElement).style.setProperty("transition", "none", "important");
  58 |         (element as HTMLElement).style.setProperty("background-color", "#1e40af", "important");
  59 |       });
  60 |       await expect.poll(() => main.evaluate(element => getComputedStyle(element).backgroundColor)).toBe("rgb(30, 64, 175)");
  61 |     }
  62 |     expect(failures, "API and JavaScript errors").toEqual([]);
  63 |     await testInfo.attach("scenario", {
  64 |       body: JSON.stringify({ id: scenario.id, path: scenario.path, viewport: page.viewportSize(), fixedDate: process.env.MEALIE_FIXED_DATE ?? "2026-10-12T12:00:00Z" }),
  65 |       contentType: "application/json",
  66 |     });
> 67 |     await expect(page).toHaveScreenshot(`${scenario.id}-${scenario.name}.png`, {
     |                        ^ Error: expect(page).toHaveScreenshot(expected) failed
  68 |       fullPage: true, animations: "disabled", maxDiffPixelRatio: 0.01, threshold: 0.2,
  69 |     });
  70 |     expect(failures, "Errors during capture").toEqual([]);
  71 |     await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, "")).toBe(scenario.path);
  72 |   });
  73 | }
  74 | 
```