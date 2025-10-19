
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:3000")
        page.wait_for_load_state()
        page.screenshot(path="jules-scratch/verification/homepage.png")
        page.goto("http://localhost:3000/ongoing")
        page.wait_for_load_state()
        page.screenshot(path="jules-scratch/verification/ongoing.png")

        # Get a valid anime link from the ongoing page
        anime_link = page.query_selector('.anime-card a')
        if anime_link:
            href = anime_link.get_attribute('href')
            page.goto(f"http://localhost:3000{href}")
            page.wait_for_load_state()
            page.screenshot(path="jules-scratch/verification/detail.png")

        page.goto("http://localhost:3000/genres")
        page.wait_for_load_state()
        page.screenshot(path="jules-scratch/verification/genres.png")

        browser.close()

run()
