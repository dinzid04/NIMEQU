const { test, expect } = require('@playwright/test');

test.describe('Search Page', () => {
  test('should display the search page correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/search?q=boruto');
    await expect(page.locator('h1')).toContainText('Hasil Pencarian: "boruto"');
    await page.screenshot({ path: 'screenshots/search.png', fullPage: true });
  });
});