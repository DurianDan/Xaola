import ScrapeResult from '../../TheSalesman/ScrapeResult';
import { ShopifyPageURL } from '../../TheSalesman/config/pages';
import * as ElementsCfg from '../../TheSalesman/config/elements';
import {
    ShopifyPartner,
    ShopifyAppDetail,
    ShopifyAppCategory,
} from '../../TheSalesman/ScrapedTable';
import BaseTrick from './BaseTrick';
import { BaseWatcher } from '../../TheWatcher/BaseWatcher';
import { mergeScrapeResult } from '../../TheSalesman/ScrapeResultUtilities';
import PuppetMaster from '../PuppetMaster';
import ScrapedElement from '../ScrapedElement.ts';

class SitemapTrick<P, E> implements BaseTrick<P, E> {
    public urls: ShopifyPageURL = new ShopifyPageURL({});
    public elements = ElementsCfg.sitemapElements;
    constructor(
        public puppetMaster: PuppetMaster<P, E>,
        public scrapedResults: ScrapeResult,
        public watcher: BaseWatcher,
    ) {
        this.puppetMaster = puppetMaster;
        this.scrapedResults = this.checkScrapedResults(scrapedResults);
    }
    async scrapePartnersElements(): Promise<ScrapedElement<P,E>[]> {
        const results = await this.puppetMaster.selectElements(
            this.elements.partnerAreaElementPath,
        );
        return results as ScrapedElement<P,E>[];
    }
    checkScrapedResults(result: ScrapeResult): ScrapeResult {
        // check if need fields has been initiated inside `this.scrapedResult`
        result.shopifyAppCategory = result.shopifyAppCategory ?? [];
        result.shopifyAppDetail = result.shopifyAppDetail ?? [];
        result.shopifyAppCategory = result.shopifyAppCategory ?? [];
        return result;
    }
    async extractHrefTextsFromChildrenTagA(
        parentElement: ScrapedElement<P,E>,
    ): Promise<{ href: string; text: string }[]> {
        const allTagA = await this.puppetMaster.selectElements(
            'a',
            parentElement,
        );
        // get all "texts" and "hrefs" inside of Tag "a", inside the Partner elements
        const allHrefTexts = await Promise.all(
            allTagA.map(async (tagA) => {
                const hrefText = await tagA.hrefAndText();
                return hrefText;
            }),
        );
        return allHrefTexts;
    }
    async extractBasicPartnerAppDetailFromPartnerElement(
        element: ScrapedElement<P,E>,
    ): Promise<ScrapeResult> {
        const allHrefTexts =
            await this.extractHrefTextsFromChildrenTagA(element);
        // First tag "a" is of the partner name and link
        const tmpPartner = new ShopifyPartner(
            null,
            new Date(),
            allHrefTexts[0].text.trim(),
            allHrefTexts[0].href,
        );
        const tmpScrapedResult: ScrapeResult = {
            shopifyPartner: [tmpPartner],
            shopifyAppDetail: [],
        };
        // Following tag "a"s are of the apps' names and links
        for (const hrefText of allHrefTexts.slice(1)) {
            tmpScrapedResult.shopifyAppDetail?.push(
                new ShopifyAppDetail(
                    null,
                    new Date(),
                    hrefText.href,
                    hrefText.text.trim(),
                    undefined,
                    undefined,
                    tmpPartner.shopifyPage,
                ),
            );
        }
        return tmpScrapedResult;
    }
    async extractBasicCategoryInfo(): Promise<ShopifyAppCategory[]> {
        const allHrefTexts = await this.puppetMaster.allTagAHrefsTexts();
        const categoryDetails: ShopifyAppCategory[] = [];
        for (const { href, text } of allHrefTexts) {
            if (href.startsWith(this.urls.appCategoryPrefix)) {
                categoryDetails.push(
                    new ShopifyAppCategory(null, new Date(), text, null, href),
                );
            }
        }
        return categoryDetails;
    }
    updateBasicPartnerAppsDetail({
        shopifyAppDetail: tmpAppsDetail,
        shopifyPartner: tmpPartner,
    }: ScrapeResult): void {
        this.scrapedResults.shopifyAppDetail?.push(...(tmpAppsDetail ?? []));
        this.scrapedResults.shopifyPartner?.push(...(tmpPartner ?? []));
    }
    updateBasicCategoryInfo({
        shopifyAppCategory: tmpCategories,
    }: ScrapeResult): void {
        this.scrapedResults.shopifyAppCategory?.push(...(tmpCategories ?? []));
    }
    async accessPage(): Promise<boolean> {
        this.watcher.info({ msg: 'Loading: ' + this.urls.sitemap });
        await this.puppetMaster.goto(this.urls.sitemap);
        return true;
    }
    async extractDerive(): Promise<ScrapeResult> {
        const partnerElements: ScrapedElement<P,E>[] =
            await this.scrapePartnersElements();
        const sitemapScrapedInfo: ScrapeResult = {
            shopifyPartner: [],
            shopifyAppDetail: [],
        };
        for (const [idx, element] of partnerElements.entries()) {
            this.watcher.info({
                msg: `idx: ${idx}/${partnerElements.length} partnerElements`,
            });
            const { shopifyPartner, shopifyAppDetail } =
                await this.extractBasicPartnerAppDetailFromPartnerElement(
                    element,
                );
            sitemapScrapedInfo.shopifyPartner?.push(...(shopifyPartner ?? []));
            sitemapScrapedInfo.shopifyAppDetail?.push(
                ...(shopifyAppDetail ?? []),
            );
        }
        const categoryInfo = await this.extractBasicCategoryInfo();
        sitemapScrapedInfo.shopifyAppCategory = categoryInfo;
        return sitemapScrapedInfo;
    }
    updateScrapeResult(scrapeResult: ScrapeResult): void {
        this.scrapedResults = mergeScrapeResult([
            scrapeResult,
            this.scrapedResults,
        ]);
    }
    async scrape(): Promise<ScrapeResult> {
        this.watcher.info({ msg: `Accessing ${this.urls.sitemap}` });
        await this.accessPage();
        this.watcher.info({ msg: `Extracting basic partner apps info...` });
        const scrapeResult = await this.extractDerive();
        this.watcher.info({
            msg: `${this.scrapedResults.shopifyPartner?.length} Partners`,
        });
        this.watcher.info({
            msg: `${this.scrapedResults.shopifyAppDetail?.length} Apps`,
        });
        this.updateScrapeResult(scrapeResult);
        return this.scrapedResults;
    }
}

export default SitemapTrick;
