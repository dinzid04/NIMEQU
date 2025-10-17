from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Manhwa Reader
        page.goto("http://localhost:3001/manhwa/chapter/the-world-after-the-fall-chapter-1")
        page.wait_for_selector("img")
        page.screenshot(path="jules-scratch/verification/manhwa-reader.png")

        browser.close()

if __name__ == "__main__":
    run()