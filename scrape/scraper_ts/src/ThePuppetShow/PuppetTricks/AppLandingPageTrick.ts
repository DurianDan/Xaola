import ScrapeResult from '../../TheSalesman/ScrapeResult';
import { ShopifyPageURL } from '../../TheSalesman/config/pages';
import { PuppetMaster, ScrapedElement } from '../PuppetMaster';
import * as ElementsCfg from '../../TheSalesman/config/elements';
import {
    ShopifyPartner,
    ShopifyAppDetail,
    ShopifyAppDescriptionLog,
    ShopifyPricingPlan,
} from '../../TheSalesman/ScrapedTable';
import { PartnerUrlConfig } from '../../TheSalesman/AudienceProfile';
import BaseTrick from './BaseTrick';


class AppLandingPageTrick implements BaseTrick{
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
            priceNameElement // sometimes there are additional price option,
            // like anual sub price, instead of the usual monthly sub.
            ))[0]
        const additionalPriceOption = additionalPriceOptionElement
                // check if the additionalPriceOptionElement has been found 
                ? (await additionalPriceOptionElement.text()).trim()
                : "" // if not, it equals to blank string ""
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
        await this.puppetMaster.goto(this.urls.appLandingPage.toString());
        const pricingPlans = 
        return this.scrapedResults    
    }
}

export default AppLandingPageTrick;