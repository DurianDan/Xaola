import { PuppeteerCrawler, Dataset, EnqueueLinksOptions, BatchAddRequestsResult } from 'crawlee';
import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';
import ComplexMaster from './ThePuppetShow/PuppetMaster/ComplexMaster';
import CrawleeWatcher from './TheWatcher/CrawleeWatcher';
// import AppLandingPageTrick from './ThePuppetShow/PuppetTricks/AppLandingPageTrick';

const sitemapURL: string = 'https://apps.shopify.com/sitemap';
type EnqueueLinksFunction = (options?: EnqueueLinksOptions) => any;

async function sitemapCrawlee(
    puppetMaster: ComplexMaster,
    watcher: CrawleeWatcher,
    enqueueLinks: EnqueueLinksFunction,
){
    const sitemapTrick = new SitemapTrick(puppetMaster, {}, watcher)
    const scrapeResult = await sitemapTrick.scrape();
    const appsLPURL: string[] = []
    for (const app of scrapeResult.shopifyAppDetail??[]){
        app.shopifyPage? appsLPURL.push( app.shopifyPage):undefined
    }
    enqueueLinks({
        label: "APP",
        transformRequestFunction(req){
            return appsLPURL.includes(req.url)?req:false
        }
    })
    enqueueLinks({
        label: "PARTNER",
        transformRequestFunction(req){
            if (sitemapTrick.isPartnerLandingPageURL(req.url)){
                return req
            }
            return false
        }
    })
    enqueueLinks({
        label: 'CATEGORY',
        transformRequestFunction(req){
            if (sitemapTrick.isAppsCategoryURL(req.url)){
                return req
            }
            return false
        }
    })
}

const crawler = new PuppeteerCrawler({
    maxRequestsPerCrawl: 2,
    async requestHandler({ request, page, log, enqueueLinks }) {
        const watcher =  new CrawleeWatcher(log)
        const puppetMaster = new ComplexMaster(
            page,
            page.browser(),
            {logNullElement: true},
            watcher
            )

        if (request.loadedUrl == sitemapURL){
            await sitemapCrawlee(puppetMaster, watcher, enqueueLinks)
            // 3 labels: "APP", "PARTNER", "CATEGORY"
        }else if (request.label == "APP"){
            
        }
    },
});

await crawler.run([sitemapURL]);