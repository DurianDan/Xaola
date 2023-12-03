import ComplexMaster from './ThePuppetShow/PuppetMaster/ComplexMaster';
// import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';
import initPuppet from './initPuppet';
import {
    debugLaunchOptions,
    defaultLaunchOptions,
} from './TheSalesman/config/browser';
import { ConsoleWatcher } from './TheWatcher';
import { isEmpty, range } from 'lodash';
import { AppReviewsTrick } from './ThePuppetShow/PuppetTricks/AppReviewsTrick';
import { defaultAppReviewsTrickConfig } from './TheSalesman/config/tricks';
import AppLandingPageTrick from './ThePuppetShow/PuppetTricks/AppLandingPageTrick';
import { shopifyAppElements } from './TheSalesman/config/elements';
import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';
import FancyCategoryTrick from './ThePuppetShow/PuppetTricks/FancyCategoryTrick';

async function scrape() {
    const { page, browser } = await initPuppet(debugLaunchOptions);
    try {
        const watcher = new ConsoleWatcher({ level: 'info' });
        const puppetMaster = new ComplexMaster(
            page,
            browser,
            { logNullElement: true },
            watcher,
        );

        const fancyCateTrick = new FancyCategoryTrick('store-management',puppetMaster, {},watcher)
        console.log(await fancyCateTrick.scrape());
        
        
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
