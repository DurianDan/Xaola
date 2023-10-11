import { PuppeteerLaunchOptions } from "puppeteer";

const defaultLaunchOptions: PuppeteerLaunchOptions = {
    headless: "new", // equivalent to headless: true
    args: [
        '--no-sandbox',
        '--incognito',
    ],
}

const debugLaunchOptions: PuppeteerLaunchOptions = {
        headless: false,
        args: [
            '--no-sandbox',
            '--incognito',
            '--start-maximized',
        ],
    }
    
export { defaultLaunchOptions, debugLaunchOptions };