import PuppetMaster from './ThePuppetShow/PuppetMaster';
// import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';
import initPuppet from './initPuppet';
import { defaultLaunchOptions } from './TheSalesman/config/browser';
import { ConsoleWatcher } from './TheWatcher';
import AppLandingPageTrick from './ThePuppetShow/PuppetTricks/AppLandingPageTrick';
import FancyCategoryTrick from './ThePuppetShow/PuppetTricks/FancyCategoryTrick';
// import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';
// import { WatchConfig } from './TheWatcher/BaseWatcher';

async function scrape() {
    const { page, browser } = await initPuppet(defaultLaunchOptions);
    try {
        const watcher = new ConsoleWatcher({ level: 'info' });
        const puppetMaster = new PuppetMaster(
            page,
            browser,
            { logNullElement: true },
            watcher,
        );

        const fancyCateTrick = new FancyCategoryTrick(
            "selling-products", puppetMaster, {}, watcher
        )
        await fancyCateTrick.accessPage()
    } catch (error) {
        console.log(error);
    } finally {
        browser.close();
    }
}

async function main() {
    await scrape();
}

main();
