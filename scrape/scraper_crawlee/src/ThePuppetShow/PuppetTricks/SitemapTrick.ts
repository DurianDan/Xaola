import RawScrapeResult from '../../TheSalesman/ScrapedResult/RawScrapeResult';
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
import { PuppetMaster } from '../PuppetMaster';
import ScrapedElement from '../ScrapedElement.ts';

interface BasicPartnerAppDetail {
    shopifyPartner: ShopifyPartner[];
    shopifyAppDetail: ShopifyAppDetail[];
}

class SitemapTrick<P, E> implements BaseTrick<P, E> {
    public urls: ShopifyPageURL = new ShopifyPageURL({});
    public elements = ElementsCfg.sitemapElements;
    constructor(
        public puppetMaster: PuppetMaster<P, E>,
        public scrapedResults: RawScrapeResult,
        public watcher: BaseWatcher,
    ) {
        this.puppetMaster = puppetMaster;
        this.scrapedResults = this.checkScrapedResults(scrapedResults);
    }
    async extractPartnersElements(): Promise<ScrapedElement<P, E>[]> {
        const results = await this.puppetMaster.selectElements(
            this.elements.partnerAreaElementPath,
        );
        this.watcher.info({
            msg: `There are ${results.length} partner elements`,
        });
        return results as ScrapedElement<P, E>[];
    }
    checkScrapedResults(result: RawScrapeResult): RawScrapeResult {
        // check if need fields has been initiated inside `this.scrapedResult`
        result.shopifyAppCategory = result.shopifyAppCategory ?? [];
        result.shopifyAppDetail = result.shopifyAppDetail ?? [];
        result.shopifyPartner = result.shopifyPartner ?? [];
        return result;
    }
    async extractHrefTextsFromChildrenTagA(
        parentElement: ScrapedElement<P, E>,
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
        element: ScrapedElement<P, E>,
    ): Promise<BasicPartnerAppDetail> {
        const allHrefTexts =
            await this.extractHrefTextsFromChildrenTagA(element);
        // First tag "a" is contains the partner name and link
        const tmpPartner = new ShopifyPartner(
            new Date(),
            allHrefTexts[0].text.trim(),
            allHrefTexts[0].href,
        );
        const tmpScrapedResult: BasicPartnerAppDetail = {
            shopifyPartner: [tmpPartner],
            shopifyAppDetail: [],
        };
        // Following tag "a"s are of the apps' names and links
        for (const hrefText of allHrefTexts.slice(1)) {
            tmpScrapedResult.shopifyAppDetail.push(
                new ShopifyAppDetail(
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
    isAppsCategoryURL(url: string): boolean{
        return (
            url.startsWith(this.urls.appCategoryPrefix)
            && !url.includes("?")
        )
    }
    isPartnerLandingPageURL(url: string): boolean{
        return (
            url.startsWith(this.urls.appPartnerPrefix)
            && !url.includes("?")
        )
    }
    async extractBasicCategoryInfo(): Promise<ShopifyAppCategory[]> {
        const allHrefTexts = await this.puppetMaster.allTagAHrefsTexts();
        const categoryDetails: ShopifyAppCategory[] = [];
        for (const { href: categoryUrl, text: name } of allHrefTexts) {
            if (this.isAppsCategoryURL(categoryUrl)) {
                categoryDetails.push(
                    new ShopifyAppCategory(
                        new Date(),
                        name.trim(),
                        undefined,
                        categoryUrl,
                    ),
                );
            }
        }
        return categoryDetails;
    }
    updateBasicPartnerAppsDetail({
        shopifyAppDetail: tmpAppsDetail,
        shopifyPartner: tmpPartner,
    }: RawScrapeResult): void {
        this.scrapedResults.shopifyAppDetail?.push(...(tmpAppsDetail ?? []));
        this.scrapedResults.shopifyPartner?.push(...(tmpPartner ?? []));
    }
    updateBasicCategoryInfo({
        shopifyAppCategory: tmpCategories,
    }: RawScrapeResult): void {
        this.scrapedResults.shopifyAppCategory?.push(...(tmpCategories ?? []));
    }
    async accessPage(): Promise<boolean> {
        await this.puppetMaster.goto(this.urls.sitemap);
        return true;
    }
    async extractBasicPartnerAppDetailFromPartnerElements(
        partnerElements: ScrapedElement<P, E>[],
    ): Promise<BasicPartnerAppDetail> {
        const partnerAppDetail = await Promise.all(
            partnerElements.map(
                async (ele) =>
                    await this.extractBasicPartnerAppDetailFromPartnerElement(
                        ele,
                    ),
            ),
        );
        const formatedPartnerAppDetail: BasicPartnerAppDetail = {
            shopifyPartner: partnerAppDetail
                .map((obj) => obj.shopifyPartner)
                .flat(1),
            shopifyAppDetail: partnerAppDetail
                .map((obj) => obj.shopifyAppDetail)
                .flat(1),
        };
        this.watcher.info({
            msg: `formatedPartnerAppDetail: ${formatedPartnerAppDetail.shopifyPartner.length} shopifyPartner`,
        });
        this.watcher.info({
            msg: `formatedPartnerAppDetail: ${formatedPartnerAppDetail.shopifyAppDetail.length} shopifyAppDetail`,
        });
        return formatedPartnerAppDetail;
    }
    async extractDerive(): Promise<RawScrapeResult> {
        const partnerElements: ScrapedElement<P, E>[] =
            await this.extractPartnersElements();
        const sitemapScrapedInfo: RawScrapeResult =
            await this.extractBasicPartnerAppDetailFromPartnerElements(
                partnerElements,
            );
        sitemapScrapedInfo.shopifyAppCategory =
            await this.extractBasicCategoryInfo();
        return sitemapScrapedInfo;
    }
    updateScrapeResult(scrapeResult: RawScrapeResult): void {
        this.scrapedResults = mergeScrapeResult([
            scrapeResult,
            this.scrapedResults,
        ]);
    }
    async scrape(): Promise<RawScrapeResult> {
        await this.accessPage();
        this.watcher.info({
            msg: `Extracting basic partner apps category info...`,
        });
        const scrapeResult = await this.extractDerive();
        this.updateScrapeResult(scrapeResult);
        return this.scrapedResults;
    }
}

export default SitemapTrick;
