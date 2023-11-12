import ScrapeResult from '../../TheSalesman/ScrapeResult';
import { ShopifyPageURL } from '../../TheSalesman/config/pages';
import PuppetMaster from '../PuppetMaster';
import * as ElementsCfg from '../../TheSalesman/config/elements';
import { BaseWatcher } from '../../TheWatcher/BaseWatcher';
import BaseTrick from './BaseTrick';
import { range } from 'lodash';


interface AppReviewsConfigWithReviewPages {
    appUrlId: string,
    reviewPages: number[]
    oldReviewsCount?: number,
}
interface AppReviewsConfigAutoDecideReviewsToScrape {
    appUrlId: string,
    oldReviewsCount: number,
    newReviewsCount: number,
}

function isWithReviewPages(config: any): config is AppReviewsConfigWithReviewPages{
    return "reviewPages" in config;
}
/**
 * Config for `AppReviesConfig` to scrape an app's reviews, with the right amount of reviews
 * @interface AppReviesConfig
 * @property {string} `appUrlId` - substring of a Shopify app url, "https://apps.shopify.com/this-app" -> `appUrlId`: "this-app"
 * @property {number} `oldReviewsCount` - the old reviews count of last scraping, used to decied what more reviews will be scraped.
 * @property {HttpUrl[]} `reviewURLs` - List of review page urls, when parsed, will overwrite `oldReviewsCount` and `appUrlId`
*/
type AppReviewsConfig = AppReviewsConfigAutoDecideReviewsToScrape | AppReviewsConfigWithReviewPages

class AppReviewsTrick implements BaseTrick {
    public urls: ShopifyPageURL;
    public reviewPages: number[]|undefined
    public elements = ElementsCfg.shopifyReviewsElements;
    constructor(
        config: AppReviewsConfig,
        public puppetMaster: PuppetMaster,
        public scrapedResults: ScrapeResult,
        public watcher: BaseWatcher,
    ) {
        this.puppetMaster = puppetMaster;
        this.urls = new ShopifyPageURL({ appUrlId : config.appUrlId });
        this.scrapedResults = this.checkScrapedResults(scrapedResults);
        this.watcher = watcher;
        this.reviewPages = this.inferReviewPages(config)
    }
    inferReviewPages(config:AppReviewsConfig):number[]{
        if (isWithReviewPages(config)){
            return config.reviewPages
        }else{
            const reviewsDiff = config.oldReviewsCount - config.newReviewsCount
            let pagesDiff = Math.ceil(reviewsDiff/this.urls.reviewsPerPage)
            pagesDiff = pagesDiff < 1 ? pagesDiff:1
            return range(1, pagesDiff+1)
        }
    }
    checkScrapedResults(result: ScrapeResult): ScrapeResult {
        this.watcher.checkInfo(result, {
            msg: 'Empty `ScrapeResult`, will return a new scrape result',
        });
        result.shopifyAppReviews = result.shopifyAppReviews ?? [];
        return result;
    }
    /**
     * To make the Puppeteer `page` to access the desired URL.
     * @returns {boolean}
     */
    async accessPage(): Promise<boolean>{
        await this.puppetMaster.goto(
            this.urls.appReviewsDefaultPage.toString()
            );
        return true;
    };
    /**
     * Extract Strings from Elements, and derive info from theme
     * @returns {any}: ScrapeResult information everything extracted
     */
    extractDerive(): Promise<ScrapeResult>;
    /**
     * Takes in a ScrapeResult object, and update to the current `this.scrapeResult`. It is meant to be used after `this.extractDerive`
     * @param {any} scrapeResult:ScrapeResult
     * @returns {any}
     */
    updateScrapeResult(scrapeResult: ScrapeResult): void;
    /**
     * Execute all necessary operations to scrape the loaded URL
     * @returns {ScrapeResult}
     */
    scrape(): Promise<ScrapeResult>;
    /**
     * Checks the parsed `ScrapeResult`, if it is `undefined` or lacking certain attributes, and automatically adds those attributes or creates a whole new `ScrapeResult`
     * @param {any} result:`ScrapeResult` object to be check
     * @returns {ScrapeResult}
     */
    checkScrapedResults(result: ScrapeResult): ScrapeResult;
}
