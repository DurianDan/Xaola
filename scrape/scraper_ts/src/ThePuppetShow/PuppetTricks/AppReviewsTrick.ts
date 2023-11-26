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
import { mergeScrapeResult } from '../../TheSalesman/ScrapeResultUtilities';

interface ReviewPageScrapeResult {
    shopifyAppReviews: ShopifyAppReview[];
    shopifyAppDetail: ShopifyAppDetail[];
}
interface AppReviewsConfigWithReviewPages {
    showMoreButtonText: string;
    appUrlId: string;
    reviewPages: number[];
}
interface AppReviewsConfigAutoDecideReviewsToScrape {
    appUrlId: string;
    showMoreButtonText: string;
    oldReviewsCount: number;
    newReviewsCount: number;
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

type ReviewPages = { url: HttpUrl; pageNum: number }[];

class AppReviewsTrick implements BaseTrick {
    public urls: ShopifyPageURL;
    public reviewPages: ReviewPages;
    public showMoreButtonText: string;
    public elements = ElementsCfg.shopifyReviewsElements;
    private approxDaysOnAppIndicators: [string, number][] = [
        ['month', 30],
        ['hour', 1 / 24],
        ['week', 7],
        ['day', 1],
        ['year', 365.5],
        ['minute', 1 / (60 * 24)],
        ['about', 0.9],
        ['almost', 0.75],
        ['over', 1.2],
    ];
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
        this.showMoreButtonText = config.showMoreButtonText; // "Show more"
    }
    inferPagesDiff({
        oldReviewsCount,
        newReviewsCount,
    }: AppReviewsConfigAutoDecideReviewsToScrape): number[] {
        const reviewsDiff = newReviewsCount - oldReviewsCount;
        let pagesDiff = Math.ceil(reviewsDiff / this.urls.reviewsPerPage);
        pagesDiff = pagesDiff < 1 ? 1 : pagesDiff;
        this.watcher.info({
            msg: `Auto infer number of pages to scrape: ${pagesDiff}`,
        });
        return range(1, pagesDiff + 1);
    }
    inferReviewPages(config: AppReviewsConfig): ReviewPages {
        let pageNums: number[];
        if (isWithReviewPages(config)) {
            pageNums = config.reviewPages;
            this.watcher.info({ msg: `Scraping specified reviews pages: ${pageNums} ` });
        } else {
            pageNums = this.inferPagesDiff(config);
        }
        return pageNums.map((pageNum) => ({
            url: this.urls.reviewPaginatedURL(pageNum).toString(),
            pageNum,
        }));
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
    async accessPagination(pageNum: number): Promise<boolean> {
        await this.puppetMaster.goto(
            this.urls.reviewPaginatedURL(pageNum).toString(),
        );
        return true;
    }

    async extractEachAppInfoElement(
        selector:string,
        elementType:string
    ): Promise<ScrapedElement|undefined>{
        return this.watcher.checkError(
            await this.puppetMaster.selectElement(selector),
            { msg: `Empty App Info: \`${elementType}\`` },
            );
        }

    async extractBasicAppDetail(): Promise<ShopifyAppDetail> {
        const appName = await this.extractEachAppInfoElement(
            this.elements.appNameElement,"appName");
        const avgRating = await this.extractEachAppInfoElement(
            this.elements.avgReviewElement, "avgRating");
        const reviewCountElement = await this.extractEachAppInfoElement(
            this.elements.reviewCountElement,"reviewCount");
            
        const reviewCount = Number((
                await reviewCountElement?.text())
            ?.replace(',', '') // remove delimiter of big amount of reviews. E.g.: '1,050 reviews'
            ?.split(" review")[0].trim() // remove the `reivews` or `review` substring.
        )
        return new ShopifyAppDetail(
            null,
            new Date(),
            this.urls.appLandingPage.toString(),
            appName ? await appName.text() : undefined,
            reviewCount,
            avgRating ? Number(await avgRating.text()) : undefined,
        );
    }
    /**
     * Click on all "Show more" button elements, to open every hidden text
     * @returns {any}
     */
    async clickAllShowMoreButton(): Promise<void> {
        const allButtonElements =
            await this.puppetMaster.selectElements('button');
        for (const buttonElement of allButtonElements) {
            const buttonText = await buttonElement.text();
            if (buttonText.trim() === this.showMoreButtonText) {
                await buttonElement.click();
            }
        }
    }
    async extractReviewElements(): Promise<ScrapedElement[]> {
        const foundFancyReviews = await this.puppetMaster.selectElements(
            this.elements.reviewSectionElements.fancy,
        );
        const foundNormalReviews = await this.puppetMaster.selectElements(
            this.elements.reviewSectionElements.normal,
        );
        if (foundFancyReviews.length > foundNormalReviews.length) {
            return foundFancyReviews;
        } else {
            return foundNormalReviews;
        }
    }
    async extractApproxDaysOnApp(
        daysOnAppLine?: ScrapedElement,
    ): Promise<undefined | number> {
        if (daysOnAppLine) {
            const daysOnAppString = (
                await (await daysOnAppLine).text()
            ).toLowerCase();
            const rawPeriod = Number(daysOnAppString.match(/\d+/g) ?? [0]);
            for (const [approxIndicator, conversionRate] of this
                .approxDaysOnAppIndicators) {
                daysOnAppString.includes(approxIndicator)
                    ? rawPeriod * conversionRate
                    : undefined;
            }
            return rawPeriod;
        } else {
            return undefined;
        }
    }
    async extractDeriveRating(
        ratingElement?: ScrapedElement,
    ): Promise<number | undefined> {
        if (ratingElement) {
            const ratingLine = (
                await ratingElement.getProperty('aria-label')
            ).trim(); // 3 out of 5 stars
            return Number(ratingLine.slice(0, 1));
        } else {
            return undefined;
        }
    }
    async extractReviewInfo({
        element,
        pageNum: pageNum,
    }: {
        element: ScrapedElement;
        pageNum: number;
    }): Promise<ShopifyAppReview> {
        const innerSelector =
            this.elements.reviewSectionElements.innerElementsSelectors;
        const quickSelect = async (selector: string) => {
            return await this.puppetMaster.selectElement(selector, element);
                    };
        const storeName = await quickSelect(innerSelector.storeName);
                const storeLocation = await quickSelect(innerSelector.storeLocation);
        const daysOnApp = await quickSelect(innerSelector.DaysOnAppLine);
        const content = await quickSelect(innerSelector.content);
        const ratingElement = await quickSelect(innerSelector.rating);
        return new ShopifyAppReview(
            null,
            new Date(),
            this.urls.appLandingPage.toString(),
            pageNum,
            storeName ? (await storeName.text()).trim() : undefined,
            storeLocation ? (await storeLocation.text()).trim() : undefined,
            content ? (await content.text()).trim() : undefined,
            await this.extractApproxDaysOnApp(daysOnApp),
            await this.extractDeriveRating(ratingElement),
        );
    }
    async extractReviewsInPage(currentPageNum: number): Promise<ShopifyAppReview[]> {
        const reviewElements = await this.extractReviewElements();
        
        let reviews: ShopifyAppReview[] = [];
        for (const element of reviewElements) {
            const tmpExtractedReview = await this.extractReviewInfo({
                element,
                pageNum: currentPageNum,
            });
            reviews.push(tmpExtractedReview);
        }
        return reviews;
    }
    async extractDerive(): Promise<ReviewPageScrapeResult> {
        let tmpScrapeResult: ReviewPageScrapeResult = {
            shopifyAppReviews: [],
            shopifyAppDetail: [],
        };
        for (const { url: _, pageNum } of this.reviewPages) {
            await this.accessPagination(pageNum);
            if (pageNum === 1) {
                this.watcher.info({ msg: 'Extracting basic app details' });
                tmpScrapeResult.shopifyAppDetail.push(
                    await this.extractBasicAppDetail(),
                );
            }
            tmpScrapeResult.shopifyAppReviews.push(
                ...(await this.extractReviewsInPage(pageNum)),
            );
        }
        return tmpScrapeResult;
    }
    updateScrapeResult(scrapeResult: ScrapeResult): void {
        mergeScrapeResult([scrapeResult, this.scrapedResults]);
    }
    async scrape(): Promise<ScrapeResult> {
        const scrapedResult = await this.extractDerive();
        this.updateScrapeResult(scrapedResult);
        return this.scrapedResults;
    }
}

export { AppReviewsTrick, AppReviewsConfig };
