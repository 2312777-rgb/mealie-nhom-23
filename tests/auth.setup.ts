import { expect, test as setup } from "@playwright/test";

const authFile = ".auth/user.json";

setup("authenticate test user", async ({ page }) => {
  const email = process.env.MEALIE_TEST_EMAIL;
  const password = process.env.MEALIE_TEST_PASSWORD;
  if (!email || !password) {
    throw new Error("Set MEALIE_TEST_EMAIL and MEALIE_TEST_PASSWORD in .env before running visual tests.");
  }

  await page.goto("/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /log in|sign in/i }).click();
  await page.waitForLoadState("networkidle");
  await expect(page).not.toHaveURL(/\/login/);
  await page.context().storageState({ path: authFile });
});
