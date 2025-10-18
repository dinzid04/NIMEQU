const { test, expect } = require('@playwright/test');

test.describe('Genre Page', () => {
  test('should display the genre page correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/genres');
    await expect(page.locator('h1')).toContainText('Genre Anime');
    await page.screenshot({ path: 'screenshots/genre.png', fullPage: true });
  });
});