import PuppetMaster from './ThePuppetShow/PuppetMaster';
// import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';
import initPuppet from './initPuppet';
import { defaultLaunchOptions } from './TheSalesman/config/browser';
import { ConsoleWatcher } from './TheWatcher';
import AppLandingPageTrick from './ThePuppetShow/PuppetTricks/AppLandingPageTrick';
import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';
// import { WatchConfig } from './TheWatcher/BaseWatcher';

async function scrape() {
    const {page, browser} = await initPuppet(defaultLaunchOptions)
    try {
        const watcher = new ConsoleWatcher({level: "info"})
        const puppetMaster = new PuppetMaster(
            page, browser, {logNullElement: true}, watcher,);

        const appLPTrick = new AppLandingPageTrick("geolocation",puppetMaster, {}, watcher);
        await appLPTrick.accessPage();
        let allScrapedResult = await appLPTrick.scrape();
            
        const sitemapTrick = new SitemapTrick(puppetMaster, allScrapedResult, watcher)
        allScrapedResult = await sitemapTrick.scrape()
        console.log("shopifyPartner: " +allScrapedResult.shopifyPartner?.length)
        console.log("shopifyAppCategory: " +allScrapedResult.shopifyAppCategory?.length)
        console.log("shopifyAppDescriptionLog: " +allScrapedResult.shopifyAppDescriptionLog?.length)
        console.log("shopifyAppDetail: " +allScrapedResult.shopifyAppDetail?.length)
        console.log("shopifyAppReviews: " +allScrapedResult.shopifyAppReviews?.length)
        console.log("shopifyCategoryRankLog: " +allScrapedResult.shopifyCategoryRankLog?.length)
        console.log("shopifyCommunityUserStats: " +allScrapedResult.shopifyCommunityUserStats?.length)
        console.log("shopifyCommunityUserStatsLog: " +allScrapedResult.shopifyCommunityUserStatsLog?.length)
        console.log("shopifyPricingPlan: " +allScrapedResult.shopifyPricingPlan?.length)
    } catch (error) {
        console.log(error);
    } finally{
        browser.close();
    }
}

async function main() {
    await scrape();
}

main();
