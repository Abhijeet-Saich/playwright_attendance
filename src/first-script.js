import { chromium } from "playwright";

async function main() {

    let COMP_URL = 'https://pipin.greythr.com/';
    let USER = "P266";
    let PASSWORD = "Pippin266!@#$%";


    let browser = await chromium.launch({ headless: false });
    let context = await browser.newContext();
    let page = await context.newPage();

    await page.goto(COMP_URL);

    //selectors
    let username = page.getByLabel("Login ID");
    let password = page.getByLabel("Password");
    // to log in into portal
    let login = page.getByRole('button', { name: "Login" })
    let logout = page.getByRole('link', { name: 'Logout' })
    // to mark the atttendance
    let signin = page.getByRole('button', { name: 'Sign In' });
    let signout = page.getByRole('button', { name: 'Sign Out' });

    //filling values 
    await username.fill(USER);
    await password.fill(PASSWORD);
    await login.click();

    await Promise.race([
        signin.waitFor({ state: 'visible' }),
        signout.waitFor({ state: 'visible' })
    ]);

    const state = await signin.isVisible() ? "OUT" : await signout.isVisible() ? "IN" : "UNKNOWN";

    console.log("Current State:", state);

    await logout.click();

    await browser.close();
}


main();