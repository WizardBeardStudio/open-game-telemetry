import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

test('test login flow', async ({ page }) => {
    await page.route("**/api/auth/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        user: { id: 1, email: "test@gmail.com", password: "@Testpassword12345" },
      }),
    });
  });

  await page.goto('/login');

  await page.getByLabel('email').fill("test@gmail.com");

  await page.getByLabel('password').fill('@Testpassword12345');

  await page.getByRole('button').getByText('Login').click();

  await expect(page).toHaveURL('/home');
})