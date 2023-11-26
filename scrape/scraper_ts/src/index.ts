import PuppetMaster from './ThePuppetShow/PuppetMaster';
// import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';
import initPuppet from './initPuppet';
import {
    // debugLaunchOptions,
    defaultLaunchOptions,
} from './TheSalesman/config/browser';
import { ConsoleWatcher } from './TheWatcher';
import { range } from 'lodash';
import { AppReviewsTrick } from './ThePuppetShow/PuppetTricks/AppReviewsTrick';
import { defaultAppReviewsTrickConfig } from './TheSalesman/config/tricks';

async function scrape() {
    let errorCount = 0;
    let sucessCount = 0;

    for (const _ of range(0, 100)) {
        await new Promise((r) => setTimeout(r, 5000));
        const { page, browser } = await initPuppet(defaultLaunchOptions);
        try {
            const watcher = new ConsoleWatcher({ level: 'info' });
            const puppetMaster = new PuppetMaster(
                page,
                browser,
                { logNullElement: true },
                watcher,
            );

            const reviewTrick = new AppReviewsTrick(
                defaultAppReviewsTrickConfig('buy-button', 370),
                puppetMaster,
                {},
                watcher,
            );

            const result = await reviewTrick.extractDerive();
            console.log(result);
        } catch (error) {
            console.log(error);
            errorCount += 1;
        } finally {
            console.log(`> Success counts: ${sucessCount}`);
            console.log(`> Error counts: ${errorCount}`);
            browser.close();
        }
    }
}

async function main() {
    await scrape();
}
main();
