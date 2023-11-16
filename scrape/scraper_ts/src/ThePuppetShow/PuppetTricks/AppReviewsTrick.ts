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
    private approxDaysOnAppIndicators: [string, number][] = [ 
        ["month", 30],
        ["hour", 1/24],
        ["week", 7],
        ["day", 1],
        ["year", 365.5],
        ["minute", 1/60],
        ["about", 0.9],
        ["almost", 0.75],
        ["over", 1.2]
    ]
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
        const foundFancyReviews = await this.puppetMaster.selectElements(
            this.elements.reviewSectionElements.fancy
        )
        const foundNormalReviews = await this.puppetMaster.selectElements(
            this.elements.reviewSectionElements.normal
        )
        if(foundFancyReviews.length > foundNormalReviews.length){
            return foundFancyReviews
        }else{
            return foundNormalReviews
        }
    }
    async extractApproxDaysOnApp(daysOnAppLine?: ScrapedElement): Promise<undefined|number>{
        if (daysOnAppLine){
            const daysOnAppString = (await (await daysOnAppLine).text()).toLowerCase()
            const rawPeriod = Number(daysOnAppString.match(/\d+/g)??[0]);
            for (const [approxIndicator, conversionRate] of this.approxDaysOnAppIndicators){
                daysOnAppString.includes(approxIndicator) ? rawPeriod*conversionRate:undefined
            }
            return rawPeriod
        }else{
            return undefined
        }
    }
    async extractDeriveRating(ratingElement?: ScrapedElement): Promise<number|undefined>{
        if (ratingElement){
            const ratingLine = (await ratingElement.getProperty("aria-label")).trim() // 3 out of 5 stars
            return Number(ratingLine.slice(0,1))
        }else{
            return undefined
        }
    }
    async extractReviewInfo({element, pageNum: pageNum}:{element: ScrapedElement, pageNum: number}): Promise<ShopifyAppReview>{
        const innerSelector = this.elements.reviewSectionElements.innerElementsSelectors
        const quickSelect = async (selector: string) => {
            return await this.puppetMaster.selectElement(selector, element)
        }
        const storeName = await quickSelect(innerSelector.storeName)
        const storeLocation = await quickSelect(innerSelector.storeLocation)
        const daysOnApp = await quickSelect(innerSelector.DaysOnAppLine)
        const content = await quickSelect(innerSelector.content)
        const ratingElement = await quickSelect(innerSelector.rating)
        return new ShopifyAppReview(
            null,
            new Date(),
            this.urls.appLandingPage.toString(),
            pageNum,
            storeName?(await storeName.text()).trim():undefined,
            storeLocation?(await storeLocation.text()).trim():undefined,
            content?(await content.text()).trim():undefined,
            await this.extractApproxDaysOnApp(daysOnApp),
            await this.extractDeriveRating(ratingElement),
        )
    }
    async extractReviewsInPage(pageNum: number): Promise<ShopifyAppReview[]> {
        const reviewElements = await this.extractReviewElements()
        let reviews: ShopifyAppReview[] = []
        for (const element of reviewElements){
            const tmpExtractedReview = await this.extractReviewInfo(
                {element, pageNum}
                )
            reviews.push(tmpExtractedReview)
        }
        return reviews
    }
    async extractDerive(): Promise<{
        shopifyAppReviews: ShopifyAppReview[],
        shopifyAppDetail: ShopifyAppDetail[]
    }>{
        const tmpScrapedResult = {}

    }
    updateScrapeResult(scrapeResult: ScrapeResult): void;
    scrape(): Promise<ScrapeResult>;
}
