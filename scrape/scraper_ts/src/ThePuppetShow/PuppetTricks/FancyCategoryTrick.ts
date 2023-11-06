import ScrapeResult from '../../TheSalesman/ScrapeResult';
import { ShopifyPageURL } from '../../TheSalesman/config/pages';
import PuppetMaster from '../PuppetMaster';
import ScrapedElement from '../ScrapedElement';
import * as ElementsCfg from '../../TheSalesman/config/elements';
import {
    ShopifyPartner,
    ShopifyAppDetail,
    ShopifyAppDescriptionLog,
    ShopifyPricingPlan,
    HttpUrl,
    ShopifyCategoryRankLog,
} from '../../TheSalesman/ScrapedTable';
import BaseTrick from './BaseTrick';
import { BaseWatcher } from '../../TheWatcher/BaseWatcher';
import { appRankFromAppDetail, mergeScrapeResult } from '../../TheSalesman/ScrapeResultUtilities';

class FancyCategoryTrick implements BaseTrick {
    public urls: ShopifyPageURL;
    public elements = ElementsCfg.fancyCategoryElements;
    constructor(
        partnerUrlId: string,
        public currentPageIdx: number = 1,
        public puppetMaster: PuppetMaster,
        public scrapedResults: ScrapeResult,
        public watcher: BaseWatcher,
    ) {
        this.puppetMaster = puppetMaster;
        this.urls = new ShopifyPageURL({partnerUrlId});
        this.scrapedResults = this.checkScrapedResults(scrapedResults);
        this.watcher = watcher;
        this.currentPageIdx = currentPageIdx

    }
    checkScrapedResults(result: ScrapeResult): ScrapeResult {
        this.watcher.checkInfo(result, {
            msg: 'Empty `ScrapeResult`, will return a new scrape result',
        });
        result.shopifyAppDetail = result.shopifyAppDetail ?? [];
        result.shopifyCategoryRankLog= result.shopifyCategoryRankLog ?? [];
        return result;
    }
    async accessPage(): Promise<boolean> {
        await this.puppetMaster.goto(this.urls.appCategoryPage.toString());
        return true;
    }
    async extractAppRankElements(): Promise<{element:ScrapedElement, rank: number}[]>{
        const elements = await this.puppetMaster.selectElements(
            this.elements.appCateogryInfo.positions,
            undefined, "AppsRanksElements"
        )
        return elements.map((value, index) =>{
            return {
                element: value,
                rank: index
            }
        })
    }
    async extractLinkNameFromRankElement(element: ScrapedElement): Promise<{appName: string, appLink: HttpUrl}>{
        const innerTagA = await this.puppetMaster.selectElement(
            this.elements.appCateogryInfo.innerTagASelector,
            element
        )
        const {href: appLink, text: appName} = await innerTagA.hrefAndText();
        return {appLink, appName: appName.trim()}
    }
    async extractAvgRatingFromRankElement(element: ScrapedElement): Promise<number>{
        const ratingElement = await this.puppetMaster.selectElement(
            this.elements.appCateogryInfo.innerAvgRatingSelector,
            element
        )
        const ratingString = (await ratingElement.text()).trim();
        // '3.4\n               out of 5 stars'
        return Number(ratingString.split("\n")[0])
    }
    async extractReviewCountFromRankElement(element: ScrapedElement): Promise<number>{
        const reviewCountElement = await this.puppetMaster.selectElement(
            this.elements.appCateogryInfo.innerReviewCountSelector,
            element
        )
        // '56 total reviews'
        const reviewCountString = await reviewCountElement.text()
        return Number(reviewCountString.replace("total reviews","").trim())
    }
    async extractAppDetailFromRankElement(element: ScrapedElement): Promise<ShopifyAppDetail>{
        const {appLink, appName} = await this.extractLinkNameFromRankElement(element)
        const avgRating = await this.extractAvgRatingFromRankElement(element)
        const reviewCount = await this.extractReviewCountFromRankElement(element)
    
        return new ShopifyAppDetail(
            null,
            new Date(),
            appLink,
            appName,
            reviewCount,
            avgRating)

    }
    async extractAppRankInfo({rank, element}:{rank: number, element: ScrapedElement}): Promise<{appDetail: ShopifyAppDetail, appRank: ShopifyCategoryRankLog}>{
        const appDetail = await this.extractAppDetailFromRankElement(element);
        return {
            appDetail,
            appRank: appRankFromAppDetail(
                appDetail,
                this.urls.appCategoryPage.toString(),
                rank)
        }
    }
    async extractDerive(): Promise<{
        shopifyAppDetail: ShopifyAppDetail[],
        shopifyCategoryRankLog: ShopifyCategoryRankLog[]
    }> {
        const appRankElements = await this.extractAppRankElements()
        const tmpAppDetails: ShopifyAppDetail[] = [];
        const tmpCategoryRankLogs: ShopifyCategoryRankLog[] = [];
        await Promise.all(appRankElements.map(async (elementRank) => {
            const {appDetail, appRank} = await this.extractAppRankInfo(elementRank)
            tmpAppDetails.push(appDetail)
            tmpCategoryRankLogs.push(appRank)
        }))
        return {
            shopifyAppDetail: tmpAppDetails,
            shopifyCategoryRankLog: tmpCategoryRankLogs
        }
    }
    updateScrapeResult(scrapeResult: ScrapeResult): void {
        this.scrapedResults = mergeScrapeResult([scrapeResult, this.scrapedResults])
    }
    async scrape(): Promise<ScrapeResult> {
        await this.accessPage();
        const informationExtracted = await this.extractDerive();
        this.updateScrapeResult(informationExtracted)
        return this.scrapedResults;
    }
}

export default FancyCategoryTrick;
