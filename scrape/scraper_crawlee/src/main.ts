import FancyCategoryTrick from "./ThePuppetShow/PuppetTricks/FancyCategoryTrick";
import NoobMaster from "./ThePuppetShow/PuppetMaster/NoobMaster";
import ConsoleWatcher from "./TheWatcher/ConsoleWatcher";

async function main(){

}

main()


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
//     },
// });

// await crawler.run([sitemapURL]);