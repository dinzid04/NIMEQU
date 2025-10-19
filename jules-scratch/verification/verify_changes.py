from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Verify homepage
    page.goto("http://localhost:3000")
    page.screenshot(path="jules-scratch/verification/homepage.png")

    # Verify ongoing page
    page.goto("http://localhost:3000/ongoing")
    page.screenshot(path="jules-scratch/verification/ongoing.png")

    # Verify genres page
    page.goto("http://localhost:3000/genres")
    page.screenshot(path="jules-scratch/verification/genres.png")

    # Verify search page
    page.goto("http://localhost:3000/search?q=one")
    page.screenshot(path="jules-scratch/verification/search.png")

    # Verify comic page
    page.goto("http://localhost:3000/comic")
    page.screenshot(path="jules-scratch/verification/comic.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
