import puppeteer, { PuppeteerLaunchOptions, Page, Browser } from 'puppeteer';

export default async function initPuppet(
    launchOptions: PuppeteerLaunchOptions,
): Promise<{ page: Page; browser: Browser }> {
    const browser: Browser = await puppeteer.launch(launchOptions);
    const page: Page = await browser.pages().then((e) => e[0]);
    return { browser, page };
}
