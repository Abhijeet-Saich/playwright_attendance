import { chromium } from "playwright";

async function main() {
    const COMP_URL = process.env.COMP_URL;
    const USER = process.env.GREYHR_USER;
    const PASSWORD = process.env.GREYHR_PASSWORD;

    console.log(
        "PLAYWRIGHT_BROWSERS_PATH =",
        process.env.PLAYWRIGHT_BROWSERS_PATH
    );

    const browser = await chromium.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(COMP_URL);

        await page.getByLabel("Login ID").fill(USER);
        await page.getByLabel("Password").fill(PASSWORD);

        await page.getByRole('button', { name: 'Login' }).click();

        const signin = page.getByRole('button', { name: 'Sign In' });
        const signout = page.getByRole('button', { name: 'Sign Out' });

        await Promise.race([
            signin.waitFor({ state: 'visible' }),
            signout.waitFor({ state: 'visible' })
        ]);

        if (await signout.isVisible()) {
            await signout.click();
            console.log("Successfully signed out.");
        } else {
            console.log("Already signed out.");
        }

        await page.waitForTimeout(3000);

    } catch (err) {
        console.error("Sign-out failed:", err);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
}

main();