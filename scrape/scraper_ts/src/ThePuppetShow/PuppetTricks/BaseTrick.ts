import ScrapeResult from '../../TheSalesman/ScrapeResult';
import { ShopifyPageURL } from '../../TheSalesman/config/pages';
import PuppetMaster from '../PuppetMaster';
import * as ElementsCfg from '../../TheSalesman/config/elements';

export default interface BaseTrick {
    urls: ShopifyPageURL;
    puppetMaster: PuppetMaster;
    scrapedResults: ScrapeResult;
    elements: ElementsCfg.XpathPageConfig;
    /**
     * Automatically log, based on this.logConfig
     * @returns void
     */
    log: (msg: string, err: Error)=>void;
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