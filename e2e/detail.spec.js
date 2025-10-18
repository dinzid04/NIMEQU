const { test, expect } = require('@playwright/test');

test.describe('Detail Page', () => {
  test('should display the detail page correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/anime/kuzu-no-honkai');
    await expect(page.locator('h1')).toContainText('Kuzu no Honkai');
    await page.screenshot({ path: 'screenshots/detail.png', fullPage: true });
  });
});