import PuppetMaster from './ThePuppetShow/PuppetMaster';
// import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';
import initPuppet from './initPuppet';
import {
    debugLaunchOptions,
    defaultLaunchOptions,
} from './TheSalesman/config/browser';
import { ConsoleWatcher } from './TheWatcher';
import { range } from 'lodash';
import { AppReviewsTrick } from './ThePuppetShow/PuppetTricks/AppReviewsTrick';
import { defaultAppReviewsTrickConfig } from './TheSalesman/config/tricks';

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

        const reviewTrick = new AppReviewsTrick(
            defaultAppReviewsTrickConfig('buy-button', 370),
            puppetMaster,
            {},
            watcher,
        );
        // console.log(reviewTrick.reviewPages);
        
        await reviewTrick.accessPagination(1);
        await reviewTrick.clickAllShowMoreButton()
        const scrapedReviewsPage1 = await reviewTrick.extractReviewsInPage(1)
        console.log(scrapedReviewsPage1);
        
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
