import ScrapeResult from '../../TheSalesman/ScrapeResult';
import { ShopifyPageURL } from '../../TheSalesman/config/pages';
import { PuppetMaster, ScrapedElement } from '../PuppetMaster';
import * as ElementsCfg from '../../TheSalesman/config/elements';
import {
    ShopifyPartner,
    ShopifyAppDetail,
} from '../../TheSalesman/ScrapedTable';
import BaseTrick from './BaseTrick';

class SitemapTrick implements BaseTrick {
    public urls: ShopifyPageURL = new ShopifyPageURL({});
    public elements = ElementsCfg.sitemapElements;
    constructor(
        public puppetMaster: PuppetMaster,
        public scrapedResults: ScrapeResult,
    ) {
        this.puppetMaster = puppetMaster;
        this.scrapedResults = this.checkScrapedResults(scrapedResults);
    }
    async scrapePartnersElements(): Promise<ScrapedElement[]> {
        const results = await this.puppetMaster.xpathElements(
            this.elements.partnerAreaElementPath,
        );
        return results as ScrapedElement[];
    }
    checkScrapedResults(result: ScrapeResult): ScrapeResult {
        // check if need fields has been initiated inside `this.scrapedResult`
        result.shopifyAppCategory = result.shopifyAppCategory ?? [];
        result.shopifyAppDetail = result.shopifyAppDetail ?? [];
        result.shopifyAppCategory = result.shopifyAppCategory ?? [];
        return result;
    }
    async extractHrefTextsFromChildrenTagA(
        parentElement: ScrapedElement,
    ): Promise<{ href: string; text: string }[]> {
        const allTagA = await this.puppetMaster.xpathElements(
            '//a',
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
        element: ScrapedElement,
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
                ),
            );
        }
        return tmpScrapedResult;
    }
    async extractBasicCategoryInfo(): Promise<ScrapeResult> {
        const allHrefTexts = await this.puppetMaster.allTagAHrefsTexts();
        const tmpScrapedResult = {
            shopifyAppDetail: allHrefTexts.map(
                ({ href: appLink, text: appName }) =>
                    new ShopifyAppDetail(null, new Date(), appLink, appName.trim()),
            ),
        };
        return tmpScrapedResult;
    }
    updateBasicPartnerAppsDetail(
        {shopifyAppDetail: tmpAppsDetail, shopifyPartner: tmpPartner}: ScrapeResult
    ): void{
        this.scrapedResults.shopifyAppDetail?.push(...tmpAppsDetail??[])
        this.scrapedResults.shopifyPartner?.push(...tmpPartner??[])
    }
    updateBasicCategoryInfo(
        {shopifyAppCategory: tmpCategories}: ScrapeResult
    ): void{
        this.scrapedResults.shopifyAppCategory?.push(...tmpCategories??[])
    }
    async accessPage(): Promise<boolean> {
        await this.puppetMaster.goto(this.urls.sitemap);
        return true;
    }
    async scrape(): Promise<ScrapeResult> {
        await this.accessPage();
        const partnerElements: ScrapedElement[] = await this.scrapePartnersElements()
        for (const element of partnerElements){
            this.updateBasicPartnerAppsDetail(
                (await this.extractBasicPartnerAppDetailFromPartnerElement(element))
            )
        }
        this.updateBasicCategoryInfo(
            (await this.extractBasicCategoryInfo())
        )
        return this.scrapedResults
    }
}

export default SitemapTrick;
