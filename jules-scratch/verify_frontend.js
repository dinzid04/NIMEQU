const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const screenshots = async (path, fileName) => {
    await page.goto(`http://localhost:3000${path}`);
    await page.screenshot({ path: `screenshots/${fileName}` });
  };

  try {
    await screenshots('/', 'homepage.png');
    await screenshots('/ongoing', 'ongoing.png');
    await screenshots('/completed', 'completed.png');
    await screenshots('/search?q=naruto', 'search.png');
    await screenshots('/genre', 'genre.png');
    await screenshots('/comic', 'comic.png');
    console.log('Screenshots taken successfully!');
  } catch (error) {
    console.error('Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
})();