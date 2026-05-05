import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

test("tests signout flow", async ({ page }) => {
  await page.route("**/api/auth/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        user: { id: 1, email: "test@gmail.com" },
      }),
    });
  });

  await page.goto('/home');

  await page.getByRole('button').getByText('sign out').click();

  await expect(page).toHaveURL('/login');
});
