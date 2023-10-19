/** @todo Implements page scraping for individual Shopify URL.
 * 0. finish URL Config first
 * 1. Sitemap
 * 2. Nested Categories in Advertising Categories*/

import ScrapeResult from '../TheSalesman/ScrapeResult';
import { ShopifyPageURL } from '../TheSalesman/config/pages';
import { PuppetMaster, ScrapedElement } from './PuppetMaster';
import * as ElementsCfg from '../TheSalesman/config/elements';
import {
    ShopifyPartner,
    ShopifyAppDetail,
    ShopifyAppDescriptionLog,
    ShopifyAppCategory,
    ShopifyPricingPlan,
} from '../TheSalesman/ScrapedTable';
import { PartnerUrlConfig } from '../TheSalesman/AudienceProfile';

interface PuppetTrick {
    urls: ShopifyPageURL;
    puppetMaster: PuppetMaster;
    scrapedResults: ScrapeResult;
    elements: ElementsCfg.XpathPageConfig;
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

class SitemapTrick implements PuppetTrick {
    public urls: ShopifyPageURL = new ShopifyPageURL({});
    public elements: ElementsCfg.XpathPageConfig = ElementsCfg.sitemapElements;
    constructor(
        public puppetMaster: PuppetMaster,
        public scrapedResults: ScrapeResult,
    ) {
        this.puppetMaster = puppetMaster;
        this.scrapedResults = this.checkScrapedResults(scrapedResults);
    }
    async scrapePartnersElements(): Promise<ScrapedElement[]> {
        const results = await this.puppetMaster.xpathElements(
            this.elements.partnerAreaElementPath as string,
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
                    tmpPartner.shopifyPage,
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

/** @todo implement `AppLandingPageTrick`  */
class AppLandingPageTrick implements PuppetTrick{
    public urls: ShopifyPageURL;
    public elements = ElementsCfg.shopifyAppElements;
    constructor(
        partnerUrlConfig: PartnerUrlConfig,
        public puppetMaster: PuppetMaster,
        public scrapedResults: ScrapeResult,
    ) {
        this.puppetMaster = puppetMaster;
        this.urls = new ShopifyPageURL(partnerUrlConfig)
        this.scrapedResults = this.checkScrapedResults(scrapedResults);
    }
    checkScrapedResults(result: ScrapeResult): ScrapeResult {
        result.shopifyAppDescriptionLog = result.shopifyAppDescriptionLog??[];
        result.shopifyAppDetail = result.shopifyAppDetail??[];
        result.shopifyPricingPlan = result.shopifyPricingPlan??[];
        return result;
    }
    async extractDescription():Promise<string>{
        const element = await this.puppetMaster.xpathElement(this.elements.descriptionElement)
        return (await element.text()).trim()
    }
    async extractAppName():Promise<string>{
        const element = await this.puppetMaster.xpathElement(this.elements.appNameElement)
        return (await element.text()).trim()
    }
    async extractReviewCount():Promise<number>{
        const element = await this.puppetMaster.xpathElement(this.elements.reviewCountElement)
        const countLine = (await element.text()).trim()
        return Number(countLine.replace(",",""))
    }
    async extractAvgRating():Promise<number>{
        const element = await this.puppetMaster.xpathElement(this.elements.avgRatingElement)
        const rateStr = (await element.text()).match(/(\d.\d)/)
        if (rateStr){
            return Number(rateStr)
        }else{
            throw new Error(`This is not a float ${rateStr}`)
        }
    }
    async extractPartnerInfo(): Promise<{partnerName: string, partnerURL: string}>{
        const partnerHrefElement = await this.puppetMaster.xpathElement(this.elements.partnerHrefElement)
        const partnerHrefText = await partnerHrefElement.hrefAndText()
        return {
            partnerName: partnerHrefText.text,
            partnerURL: partnerHrefText.href
        }
    }
    extractCurrentAppURL(): string{
        return this.puppetMaster.page.url();
    }
    async extractAppDescriptionLogs():Promise<ShopifyAppDescriptionLog>{
        const scrapedOn = new Date();
        const appCurrentURL = this.extractCurrentAppURL()
        const description = await this.extractDescription()
        return new ShopifyAppDescriptionLog(null, scrapedOn,appCurrentURL, description)
    }
    async extractBasicPartnerDetail(): Promise<ShopifyPartner>{
        const partnerInfo = await this.extractPartnerInfo();
        return new ShopifyPartner(
            null,
            new Date(),
            partnerInfo.partnerName,
            partnerInfo.partnerURL
        )
    }
    async extractAppDetail({shopifyPage: partnerPage}: ShopifyPartner):Promise<ShopifyAppDetail>{
        return new ShopifyAppDetail(
            null,
            new Date(),
            this.extractCurrentAppURL(),
            (await this.extractAppName()),
            (await this.extractAvgRating()),
            (await this.extractReviewCount()),
            partnerPage,
        )
    }
    deriveCleanPlanOffer(rawOfferString: string): string{
        const splitted = rawOfferString.trim().split("\n");
        let cleanedString = "";
        for (const stringPiece of splitted){
            const trimmedStringPiece = stringPiece.trim();
            if (trimmedStringPiece != ""){
                cleanedString = `${cleanedString}\n${trimmedStringPiece}`;
            }
        }
        return cleanedString;
    }
    async derivePlanPriceName(
        priceNameElement: ScrapedElement
    ): Promise<{planName: string, price: string}>{
        const priceLine = await (await this.puppetMaster.xpathElement(
            this.elements.pricingPlans.priceElementTag,
            priceNameElement
            )).text()
        const planName = await (await this.puppetMaster.xpathElement(
            this.elements.pricingPlans.nameElementTag,
            priceNameElement
            )).text()
        const additionalPriceOptionElement =  (await this.puppetMaster.xpathElements(
            this.elements.pricingPlans.additionalPriceOptionElementTag,
            priceNameElement
            ))[0]
        const additionalPriceOption = additionalPriceOptionElement? (await additionalPriceOptionElement.text()).trim(): ""
        return {
            price: planName.trim(),
            planName: `${priceLine.trim()}\n${additionalPriceOption}`.trim()
        }
    }
    async derivePlanDetail(
        planElement: ScrapedElement
    ): Promise<ShopifyPricingPlan>{
        const {planName, price} = await this.derivePlanPriceName( await this.puppetMaster.xpathElement(
            this.elements.pricingPlans.priceNameElementTag,
            planElement
            ))
        const planOffer = this.deriveCleanPlanOffer(await (await this.puppetMaster.xpathElement(
            this.elements.pricingPlans.planOfferElementTag,
            planElement
            )).text())
        return new ShopifyPricingPlan(null, new Date(), planName, price, planOffer)
    }
    async extractPricingPlans(): Promise<ShopifyPricingPlan[]>{
        const planElements = await this.puppetMaster.xpathElements(
            this.elements.pricingPlans.planElement
            )
        return await Promise.all(planElements.map(async (plan) =>{
            return await this.derivePlanDetail(plan)
        }));
    }
    async accessPage(): Promise<boolean> {
        this.puppetMaster.goto(this.urls.appLandingPage.toString())
        return true;
    }
    async scrape(): Promise<ScrapeResult> {
        /** @todo implements scraping the whole page */  
        return this.scrapedResults    
    }
}

export { SitemapTrick, AppLandingPageTrick };
