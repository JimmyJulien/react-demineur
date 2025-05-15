import { expect, test } from "@playwright/test";

test("a titre 'React demineur'", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await expect(page).toHaveTitle(/React demineur/);
});
