import ScrapeResult from '../../TheSalesman/ScrapeResult';
import { ShopifyPageURL } from '../../TheSalesman/config/pages';
import PuppetMaster from '../PuppetMaster';
import * as ElementsCfg from '../../TheSalesman/config/elements';
import { BaseWatcher } from '../../TheWatcher/BaseWatcher';

export default interface BaseTrick {
    urls: ShopifyPageURL;
    puppetMaster: PuppetMaster;
    scrapedResults: ScrapeResult;
    elements: ElementsCfg.XpathPageConfig;
    watcher: BaseWatcher;
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
     * To make the Puppeteer `page` to access the desired URL.
     * @returns {boolean}
     */
    accessPage(): Promise<boolean>;
    /**
     * Checks the parsed `ScrapeResult`, if it is `undefined` or lacking certain attributes, and automatically adds those attributes or creates a whole new `ScrapeResult`
     * @param {any} result:`ScrapeResult` object to be check
     * @returns {ScrapeResult}
     */
    checkScrapedResults(result: ScrapeResult): ScrapeResult;
}
