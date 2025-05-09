import { test, expect } from "@playwright/test";

// =====================================================================================================================

test.describe("auth flow", () => {
  // =========================================
  // Signin & Signout
  // =========================================
  test("user can signin and signout", async ({ page }) => {
    await page.goto("/");

    const signInButton = page.getByRole("button", { name: /signin/i });
    await expect(signInButton).toBeVisible();
    await signInButton.click();

    await page.waitForURL(/admin/);
    await expect(page).toHaveURL(/admin/);

    const signOutButton = page.getByRole("button", { name: /signout/i });
    await expect(signOutButton).toBeVisible();
    await signOutButton.click();

    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
  });

  // =====================================================================================================================
  // =====================================================================================================================
});
