import { PuppeteerCrawler, Dataset, EnqueueLinksOptions } from 'crawlee';
import SitemapTrick from '../PuppetTricks/SitemapTrick';
import ComplexMaster from '../PuppetMaster/ComplexMaster';
import CrawleeWatcher from '../../TheWatcher/CrawleeWatcher';
// import AppLandingPageTrick from './ThePuppetShow/PuppetTricks/AppLandingPageTrick';

type EnqueueLinksFunction = (options?: EnqueueLinksOptions) => any;

async function sitemapAct(
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
            return sitemapTrick.isPartnerLandingPageURL(
                req.url
            )?req:false
        }
    })
    enqueueLinks({
        label: 'CATEGORY',
        transformRequestFunction(req){
            return sitemapTrick.isAppsCategoryURL(
                req.url
            )?req:false
        }
    })
}

export default sitemapAct;