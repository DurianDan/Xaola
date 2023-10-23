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
import { PartnerUrlConfig } from '../../TheSalesman/AudienceProfile';
import BaseTrick from './BaseTrick';
import { BaseWatcher } from '../../TheWatcher/BaseWatcher';

class AppLandingPageTrick implements BaseTrick {
    public urls: ShopifyPageURL;
    public elements = ElementsCfg.shopifyAppElements;
    constructor(
        partnerUrlConfig: PartnerUrlConfig,
        public puppetMaster: PuppetMaster,
        public scrapedResults: ScrapeResult,
        public watcher: BaseWatcher,
    ) {
        this.puppetMaster = puppetMaster;
        this.urls = new ShopifyPageURL(partnerUrlConfig);
        this.scrapedResults = this.checkScrapedResults(scrapedResults);
        this.watcher = watcher;
    }
    checkScrapedResults(result: ScrapeResult): ScrapeResult {
        this.watcher.checkInfo(result, {
            msg: 'Empty `ScrapeResult`, will return a new scrape result',
        });
        result.shopifyAppDescriptionLog = result.shopifyAppDescriptionLog ?? [];
        result.shopifyAppDetail = result.shopifyAppDetail ?? [];
        result.shopifyPricingPlan = result.shopifyPricingPlan ?? [];
        return result;
    }
    async extractDescription(): Promise<string> {
        const element = await this.puppetMaster.xpathElement(
            this.elements.descriptionElement,
        );
        this.watcher.checkError(element, {
            msg: `Cant find description element: ${this.elements.descriptionElement}`,
        });
        const description = (await element.text()).trim();
        this.watcher.checkWarn(description, {
            msg: `Cant find description element: ${this.elements.descriptionElement}`,
        });
        return description;
    }
    async extractAppName(): Promise<string> {
        const element = await this.puppetMaster.xpathElement(
            this.elements.appNameElement,
        );
        this.watcher.checkError(element, {
            msg: `Cant find appName element: ${this.elements.appNameElement}`,
        });
        const appName = (await element.text()).trim();
        this.watcher.checkWarn(appName, {
            msg: `Cant find appName element: ${this.elements.descriptionElement}`,
        });
        return appName;
    }
    async extractReviewCount(): Promise<number> {
        const element = await this.puppetMaster.xpathElement(
            this.elements.reviewCountElement,
        );
        this.watcher.checkError(element, {
            msg: `Cant find description element: ${this.elements.reviewCountElement}`,
        });
        const countLine = (await element.text()).trim();
        this.watcher.checkWarn(countLine, {
            msg: `Cant find description element: ${this.elements.reviewCountElement}`,
        });
        return Number(countLine.replace(',', ''));
    }
    async extractAvgRating(): Promise<number> {
        const element = await this.puppetMaster.xpathElement(
            this.elements.avgRatingElement,
        );
        this.watcher.checkError(element, {
            msg: `Cant find avgRating element: ${this.elements.avgRatingElement}`,
        });
        const rateStr = (await element.text()).match(/(\d.\d)/);
        this.watcher.checkError(rateStr, {
            msg: 'Cant extract float number from this string: ' + rateStr + ' ',
        });
        if (rateStr) {
            return Number(rateStr);
        } else {
            throw new Error(`This is not a float ${rateStr}`);
        }
    }
    async extractPartnerInfo(): Promise<{
        partnerName: string;
        partnerURL: string;
    }> {
        const partnerHrefElement = await this.puppetMaster.xpathElement(
            this.elements.partnerHrefElement,
        );
        const partnerHrefText = await partnerHrefElement.hrefAndText();
        return {
            partnerName: partnerHrefText.text,
            partnerURL: partnerHrefText.href,
        };
    }
    extractCurrentAppURL(): string {
        return this.puppetMaster.page.url();
    }
    async extractAppDescriptionLogs(): Promise<ShopifyAppDescriptionLog> {
        const scrapedOn = new Date();
        const appCurrentURL = this.extractCurrentAppURL();
        const description = await this.extractDescription();
        return new ShopifyAppDescriptionLog(
            null,
            scrapedOn,
            appCurrentURL,
            description,
        );
    }
    async extractBasicPartnerDetail(): Promise<ShopifyPartner> {
        const partnerInfo = await this.extractPartnerInfo();
        return new ShopifyPartner(
            null,
            new Date(),
            partnerInfo.partnerName,
            partnerInfo.partnerURL,
        );
    }
    async extractAppDetail(partnerPage: string): Promise<ShopifyAppDetail> {
        return new ShopifyAppDetail(
            null,
            new Date(),
            this.extractCurrentAppURL(),
            await this.extractAppName(),
            await this.extractAvgRating(),
            await this.extractReviewCount(),
            partnerPage,
        );
    }
    deriveCleanPlanOffer(rawOfferString: string): string {
        const splitted = rawOfferString.trim().split('\n');
        let cleanedString = '';
        for (const stringPiece of splitted) {
            const trimmedStringPiece = stringPiece.trim();
            if (trimmedStringPiece != '') {
                cleanedString = `${cleanedString}\n${trimmedStringPiece}`;
            }
        }
        return cleanedString;
    }
    async derivePlanPriceName(
        priceNameElement: ScrapedElement,
    ): Promise<{ planName: string; price: string }> {
        const priceLine = await (
            await this.puppetMaster.xpathElement(
                this.elements.pricingPlans.priceElementTag,
                priceNameElement,
            )
        ).text();
        const additionalPriceLineElement = (
            await this.puppetMaster.xpathElements(
                this.elements.pricingPlans.additionalPriceOptionElementTag,
                priceNameElement, // sometimes there are additional price option,
                // like anual sub price, instead of the usual monthly sub.
            )
        )[0];
        const additionalPriceLine = additionalPriceLineElement
            ? // check if the additionalPriceOptionElement has been found
              (await additionalPriceLineElement.text()).trim()
            : ''; // if not, it equals to blank string ""
        const planName = await (
            await this.puppetMaster.xpathElement(
                this.elements.pricingPlans.nameElementTag,
                priceNameElement,
            )
        ).text();
        return {
            price: planName.trim(),
            planName: `${priceLine.trim()}\n${additionalPriceLine}`.trim(),
        };
    }
    async derivePlanDetail(
        planElement: ScrapedElement,
        appURL: string,
    ): Promise<ShopifyPricingPlan> {
        const { planName, price } = await this.derivePlanPriceName(
            await this.puppetMaster.xpathElement(
                this.elements.pricingPlans.priceNameElementTag,
                planElement,
            ),
        );
        const planOffer = this.deriveCleanPlanOffer(
            await (
                await this.puppetMaster.xpathElement(
                    this.elements.pricingPlans.planOfferElementTag,
                    planElement,
                )
            ).text(),
        );
        return new ShopifyPricingPlan(
            null,
            new Date(),
            planName,
            price,
            planOffer,
            appURL,
        );
    }
    async extractPricingPlans(appURL: string): Promise<ShopifyPricingPlan[]> {
        const planElements = await this.puppetMaster.xpathElements(
            this.elements.pricingPlans.planElement,
        );
        return await Promise.all(
            planElements.map(async (plan) => {
                return await this.derivePlanDetail(plan, appURL);
            }),
        );
    }
    async accessPage(): Promise<boolean> {
        this.puppetMaster.goto(this.urls.appLandingPage.toString());
        return true;
    }
    async scrape(): Promise<ScrapeResult> {
        await this.puppetMaster.goto(this.urls.appLandingPage.toString());
        const partnerBasicInfo = await this.extractBasicPartnerDetail();
        const appDetails = await this.extractAppDetail(
            partnerBasicInfo.shopifyPage,
        );
        const pricingPlans = await this.extractPricingPlans(
            appDetails.shopifyPage,
        );
        const description = await this.extractAppDescriptionLogs();
        this.scrapedResults.shopifyPartner?.push(partnerBasicInfo);
        this.scrapedResults.shopifyAppDetail?.push(appDetails);
        this.scrapedResults.shopifyPricingPlan?.push(...pricingPlans);
        this.scrapedResults.shopifyAppDescriptionLog?.push(description);
        return this.scrapedResults;
    }
}

export default AppLandingPageTrick;
