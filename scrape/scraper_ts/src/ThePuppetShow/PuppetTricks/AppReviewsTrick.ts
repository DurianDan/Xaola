import ScrapeResult from '../../TheSalesman/ScrapeResult';
import { ShopifyPageURL } from '../../TheSalesman/config/pages';
import PuppetMaster from '../PuppetMaster';
import * as ElementsCfg from '../../TheSalesman/config/elements';
import { BaseWatcher } from '../../TheWatcher/BaseWatcher';
import BaseTrick from './BaseTrick';
import { range } from 'lodash';
import {
    HttpUrl,
    ShopifyAppDetail,
    ShopifyAppReview,
} from '../../TheSalesman/ScrapedTable';
import ScrapedElement from '../ScrapedElement';

interface AppReviewsConfigWithReviewPages {
    showMoreButtonText: string,
    appUrlId: string,
    reviewPages: number[],
}
interface AppReviewsConfigAutoDecideReviewsToScrape {
    appUrlId: string,
    showMoreButtonText: string,
    oldReviewsCount: number,
    newReviewsCount: number
}

function isWithReviewPages(
    config: any,
): config is AppReviewsConfigWithReviewPages {
    return 'reviewPages' in config;
}
/**
 * Config for `AppReviesConfig` to scrape an app's reviews, with the right amount of reviews
 * @interface AppReviesConfig
 * @property {string} `appUrlId` - substring of a Shopify app url, "https://apps.shopify.com/this-app" -> `appUrlId`: "this-app"
 * @property {number} `oldReviewsCount` - the old reviews count of last scraping, used to decied what more reviews will be scraped.
 * @property {HttpUrl[]} `reviewURLs` - List of review page urls, when parsed, will overwrite `oldReviewsCount` and `appUrlId`
 */
type AppReviewsConfig =
    | AppReviewsConfigAutoDecideReviewsToScrape
    | AppReviewsConfigWithReviewPages;

class AppReviewsTrick implements BaseTrick {
    public urls: ShopifyPageURL;
    public reviewPages: HttpUrl[];
    public showMoreButtonText: string;
    public elements = ElementsCfg.shopifyReviewsElements;
    constructor(
        config: AppReviewsConfig,
        public puppetMaster: PuppetMaster,
        public scrapedResults: ScrapeResult,
        public watcher: BaseWatcher,
    ) {
        this.puppetMaster = puppetMaster;
        this.urls = new ShopifyPageURL({ appUrlId: config.appUrlId });
        this.scrapedResults = this.checkScrapedResults(scrapedResults);
        this.watcher = watcher;
        this.reviewPages = this.inferReviewPages(config);
        this.showMoreButtonText = config.showMoreButtonText
    }
    inferPagesDiff({
        oldReviewsCount,
        newReviewsCount,
    }: AppReviewsConfigAutoDecideReviewsToScrape): number[] {
        const reviewsDiff = oldReviewsCount - newReviewsCount;
        let pagesDiff = Math.ceil(reviewsDiff / this.urls.reviewsPerPage);
        pagesDiff = pagesDiff < 1 ? pagesDiff : 1;
        return range(1, pagesDiff + 1);
    }
    inferReviewPages(config: AppReviewsConfig): HttpUrl[] {
        let pageNums: number[];
        if (isWithReviewPages(config)) {
            pageNums = config.reviewPages;
            this.watcher.info({ msg: `Using parsed pages: ${pageNums} ` });
        } else {
            pageNums = this.inferPagesDiff(config);
            this.watcher.info({
                msg: `Auto infer number of pages to scrape: ${pageNums}`,
            });
        }
        return pageNums.map((pageNum) =>
            this.urls.reviewPaginatedURL(pageNum).toString(),
        );
    }
    checkScrapedResults(result: ScrapeResult): ScrapeResult {
        this.watcher.checkInfo(result, {
            msg: 'Empty `ScrapeResult`, will return a new scrape result',
        });
        result.shopifyAppReviews = result.shopifyAppReviews ?? [];
        result.shopifyAppDetail = result.shopifyAppDetail ?? [];
        return result;
    }
    async accessPage(): Promise<boolean> {
        // goes to the default review page (page 1) of the app
        await this.puppetMaster.goto(
            this.urls.appReviewsDefaultPage.toString(),
        );
        return true;
    }
    async extractBasicAppDetail(): Promise<ShopifyAppDetail> {
        const appName = await (
            await this.puppetMaster.selectElement(this.elements.appNameElement)
        ).text();
        const avgRating = Number(
            await (
                await this.puppetMaster.selectElement(
                    this.elements.avgReviewElement,
                )
            ).text(),
        );
        const reviewCount = Number(
            (
                await (
                    await this.puppetMaster.selectElement(
                        this.elements.reviewCountElement,
                    )
                ).text()
            ).replace(',', ''),
        );
        return new ShopifyAppDetail(
            null,
            new Date(),
            this.puppetMaster.page.url(),
            appName,
            reviewCount,
            avgRating,
        );
    }
    /**
     * Click on all "Show more" button elements, to open every hidden text
     * @returns {any}
     */
    async clickAllShowMoreButton(): Promise<void>{
        const allButtonElements = await this.puppetMaster.selectElements('button')
        for (const buttonElement of allButtonElements) {
            const buttonText = await buttonElement.text()
            if (buttonText.trim() === this.showMoreButtonText){
                await buttonElement.click()
            }
        }
    }
    async extractReviewElements(): Promise<ScrapedElement[]> {
        return await this.puppetMaster.selectElements(
            this.elements.
        )
    }
    async extractReviewsInPage(): Promise<ShopifyAppReview[]> {
        
    }
    extractDerive(): Promise<ScrapeResult>;
    updateScrapeResult(scrapeResult: ScrapeResult): void;
    scrape(): Promise<ScrapeResult>;
}
