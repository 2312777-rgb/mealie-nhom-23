import { test, expect, type APIRequestContext, type Page, type TestInfo } from "@playwright/test";

let api: APIRequestContext;

async function captureEvidence(page: Page, testInfo: TestInfo, name: string): Promise<void> {
  await expect(page.locator(".spin-enter-active, .spin-enter-from, .spin-enter-to")).toHaveCount(0);
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.screenshot({ path: testInfo.outputPath(name), fullPage: true, animations: "disabled" });
}

test.beforeAll(async ({ playwright }) => {
  api = await playwright.request.newContext({ baseURL: process.env.MEALIE_API_URL ?? "http://localhost:19000" });
  const login = await api.post("/api/auth/token", { form: { username: process.env.MEALIE_TEST_EMAIL!, password: process.env.MEALIE_TEST_PASSWORD! } });
  expect(login.ok(), "QA API authentication").toBeTruthy();
  const token = (await login.json()).access_token;
  await api.dispose();
  api = await playwright.request.newContext({ baseURL: process.env.MEALIE_API_URL ?? "http://localhost:19000", extraHTTPHeaders: { Authorization: `Bearer ${token}` } });
});
test.afterAll(async () => { await api?.dispose(); });

test("FLOW01 create recipe through API and read it in UI", async ({ page }, testInfo) => {
  const response = await api.post("/api/recipes", { data: { name: "QA Smoke Recipe" } });
  expect(response.status()).toBe(201);
  const slug: string = await response.json();
  try {
    const recipe = await api.get(`/api/recipes/${slug}`);
    expect((await recipe.json()).name).toBe("QA Smoke Recipe");
    await page.goto(`/g/${process.env.MEALIE_TEST_GROUP_SLUG}/r/${slug}`);
    await expect(page.locator("main").getByText("QA Smoke Recipe").first()).toBeVisible();
    await captureEvidence(page, testInfo, "FLOW01.png");
  } finally { expect((await api.delete(`/api/recipes/${slug}`)).ok()).toBeTruthy(); }
});

test("FLOW02 create meal entry through API and read planner", async ({ page }, testInfo) => {
  const response = await api.post("/api/households/mealplans", { data: { date: "2026-10-12", entryType: "lunch", title: "QA Smoke Lunch" } });
  expect(response.status()).toBe(201);
  const entry = await response.json();
  try {
    await page.clock.setFixedTime(new Date("2026-10-12T12:00:00Z"));
    await page.goto("/household/mealplan/planner/view");
    await expect(page.locator("main").getByText("QA Smoke Lunch").first()).toBeVisible();
    await captureEvidence(page, testInfo, "FLOW02.png");
  } finally { expect((await api.delete(`/api/households/mealplans/${entry.id}`)).ok()).toBeTruthy(); }
});

test("FLOW03 create shopping list through API and read list page", async ({ page }, testInfo) => {
  const response = await api.post("/api/households/shopping/lists", { data: { name: "QA Smoke Shopping" } });
  expect(response.status()).toBe(201);
  const list = await response.json();
  try {
    await page.goto("/shopping-lists");
    await expect(page.locator("main").getByText("QA Smoke Shopping").first()).toBeVisible();
    await captureEvidence(page, testInfo, "FLOW03.png");
  } finally { expect((await api.delete(`/api/households/shopping/lists/${list.id}`)).ok()).toBeTruthy(); }
});
