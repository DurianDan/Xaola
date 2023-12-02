// import ScrapeResult from '../../TheSalesman/ScrapeResult';
// import { ShopifyPageURL } from '../../TheSalesman/config/pages';
// import ComplexMaster from '../PuppetMaster/ComplexMaster';
// import ComplexScrapedElement from '../ScrapedElement.ts/ComplexScrapedElement';
// import * as ElementsCfg from '../../TheSalesman/config/elements';
// import {
//     ShopifyPartner,
//     ShopifyAppDetail,
//     ShopifyAppDescriptionLog,
//     ShopifyPricingPlan,
// } from '../../TheSalesman/ScrapedTable';
// import BaseTrick from './BaseTrick';
// import { BaseWatcher } from '../../TheWatcher/BaseWatcher';
// import { mergeScrapeResult } from '../../TheSalesman/ScrapeResultUtilities';

// class PartnerPageTrick implements BaseTrick {
//     public urls: ShopifyPageURL;
//     public elements = ElementsCfg.shopifyPartnerElements;
//     constructor(
//         partnerUrlId: string,
//         public puppetMaster: ComplexMaster,
//         public scrapedResults: ScrapeResult,
//         public watcher: BaseWatcher,
//     ) {
//         this.puppetMaster = puppetMaster;
//         this.urls = new ShopifyPageURL({ partnerUrlId });
//         this.scrapedResults = this.checkScrapedResults(scrapedResults);
//         this.watcher = watcher;
//     }
//     checkScrapedResults(result: ScrapeResult): ScrapeResult {
//         this.watcher.checkInfo(result, {
//             msg: 'Empty `ScrapeResult`, will return a new scrape result',
//         });
//         result.shopifyPartner = result.shopifyPartner ?? [];
//         result.shopifyAppDetail = result.shopifyAppDetail ?? [];
//         result.shopifyPricingPlan = result.shopifyPricingPlan ?? [];
//         result.shopifyAppDescriptionLog = result.shopifyAppDescriptionLog ?? [];
//         return result;
//     }
