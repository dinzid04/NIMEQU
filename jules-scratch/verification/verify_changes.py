from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    context = browser.new_context()
    page = context.new_page()

    # Verify homepage
    page.goto("http://localhost:3000")
    page.screenshot(path="jules-scratch/verification/homepage.png")

    # Verify comic page
    page.goto("http://localhost:3000/comic")
    page.screenshot(path="jules-scratch/verification/comicpage.png")

    # Verify mobile navigation
    page.set_viewport_size({"width": 375, "height": 667})
    page.goto("http://localhost:3000")
    page.screenshot(path="jules-scratch/verification/mobile_nav.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)