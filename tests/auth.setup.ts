import { expect, test as setup } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const authFile = ".auth/user.json";

setup("authenticate test user", async ({ page }) => {
  await mkdir(".auth", { recursive: true });
  const email = process.env.MEALIE_TEST_EMAIL;
  const password = process.env.MEALIE_TEST_PASSWORD;
  if (!email || !password) {
    throw new Error("Set MEALIE_TEST_EMAIL and MEALIE_TEST_PASSWORD in .env before running visual tests.");
  }

  await page.goto("/login");
  await page.getByLabel(/email/i).fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await expect(page).not.toHaveURL(/\/login/);
  await expect(page.locator("main")).toBeVisible();
  await page.context().storageState({ path: authFile });
});
