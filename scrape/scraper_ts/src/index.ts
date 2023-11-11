import PuppetMaster from './ThePuppetShow/PuppetMaster';
// import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';
import initPuppet from './initPuppet';
import {
    // debugLaunchOptions,
    defaultLaunchOptions,
} from './TheSalesman/config/browser';
import { ConsoleWatcher } from './TheWatcher';
import FancyCategoryTrick from './ThePuppetShow/PuppetTricks/FancyCategoryTrick';
import { range } from 'lodash';

async function scrape() {
    let errorCount = 0;
    let sucessCount = 0;

    for (const _ of range(0,100)){
        await new Promise(r => setTimeout(r, 5000));
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
            const results = await fancyCateTrick.extractDerive()
            console.log(results.shopifyAppDetail[0]);
            sucessCount += 1;
            console.log(`>>> Success rate: ${sucessCount/100}`);            
        } catch (error) {
            console.log(error);
            errorCount += 1
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
