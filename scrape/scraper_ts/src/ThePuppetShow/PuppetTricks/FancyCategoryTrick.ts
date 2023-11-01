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
} from '../../TheSalesman/ScrapedTable';
import BaseTrick from './BaseTrick';
import { BaseWatcher } from '../../TheWatcher/BaseWatcher';
import { mergeScrapeResult } from '../../TheSalesman/ScrapeResultUtilities';

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
    async extractDerive(): Promise<ScrapeResult> {
        ...
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
