import { PuppeteerLaunchOptions } from "puppeteer";

const defaultLaunchOptions: PuppeteerLaunchOptions = {
    headless: false,
    args: [
        '--no-sandbox',
        '--incognito',
        '--start-maximized',
    ],
}

export { defaultLaunchOptions };