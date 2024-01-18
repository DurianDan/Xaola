import FancyCategoryTrick from './ThePuppetShow/PuppetTricks/FancyCategoryTrick';
import PartnerPageTrick from './ThePuppetShow/PuppetTricks/PartnerPageTrick';
import NoobMaster from './ThePuppetShow/PuppetMaster/NoobMaster';
import ConsoleWatcher from './TheWatcher/ConsoleWatcher';

async function main() {
    const testFancyCateURL =
        'https://apps.shopify.com/tiktok';
    const $ = await NoobMaster.loadCheerioAPI(testFancyCateURL);
    console.log('Title of the loaded page: ' + $('title').text());
    const watcher = new ConsoleWatcher({ level: 'info' });
    const puppetMaster = new NoobMaster(
        { logNullElement: true },
        $,
        watcher,
        testFancyCateURL,
    );
    const fancyCategoryTrick = new FancyCategoryTrick(
        testFancyCateURL,
        puppetMaster,
        {},
        watcher,
    );
    const partnerTrick = new PartnerPageTrick(
        'shopify',
        puppetMaster,
        {},
        watcher,
        fancyCategoryTrick,
    );
    // const scrapedResultFancyCate = await fancyCategoryTrick.scrape();
    // console.log(
    //     (scrapedResultFancyCate.shopifyAppDetail ?? [])[0].toDBRecord(),
    // );

    const scrapedPartner = await partnerTrick.scrape();
    console.log((scrapedPartner.shopifyAppDetail ?? [])[0].toDBRecord());
    console.log((scrapedPartner.shopifyPartner ?? [])[0].toDBRecord());
}

main();

// import { PuppeteerCrawler } from 'crawlee';
// import ComplexMaster from './ThePuppetShow/PuppetMaster/ComplexMaster';
// import CrawleeWatcher from './TheWatcher/CrawleeWatcher';

// import sitemapAct from './ThePuppetShow/Acts/SitemapAct';

// const sitemapURL: string = 'https://apps.shopify.com/sitemap';

// const crawler = new PuppeteerCrawler({
//     maxRequestsPerCrawl: 2,
//     async requestHandler({ request, page, log, enqueueLinks }) {
//         const watcher =  new CrawleeWatcher(log)
//         const puppetMaster = new ComplexMaster(
//             page,
//             page.browser(),
//             {logNullElement: true},
//             watcher
//             )

//         if (request.loadedUrl == sitemapURL){
//             await sitemapAct(puppetMaster, watcher, enqueueLinks)
//             // 3 labels: "APP", "PARTNER", "CATEGORY"
//         }else if (request.label == "APP"){

//         }
//         const scrapedURLs = [];
//         crawler.addRequests(scrapedURLs);
//     },
// });

// await crawler.run([sitemapURL]);
