import ScrapeResult from '../../TheSalesman/ScrapeResult';
import { ShopifyPageURL } from '../../TheSalesman/config/pages';
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
import PuppetMaster from '../PuppetMaster';
import ScrapedElement from '../ScrapedElement.ts';

class AppLandingPageTrick<P, E> implements BaseTrick<P, E> {
    public urls: ShopifyPageURL;
    public elements = ElementsCfg.shopifyAppElements;
    constructor(
        appUrlId: string,
        public puppetMaster: PuppetMaster<P, E>,
        public scrapedResults: ScrapeResult,
        public watcher: BaseWatcher,
    ) {
        this.puppetMaster = puppetMaster;
        this.urls = new ShopifyPageURL({ appUrlId });
        this.scrapedResults = this.checkScrapedResults(scrapedResults);
        this.watcher = watcher;
    }
    checkScrapedResults(result: ScrapeResult): ScrapeResult {
        this.watcher.checkInfo(result, {
            msg: 'Empty `ScrapeResult`, will return a new scrape result',
        });
        result.shopifyPartner = result.shopifyPartner ?? [];
        result.shopifyAppDetail = result.shopifyAppDetail ?? [];
        result.shopifyPricingPlan = result.shopifyPricingPlan ?? [];
        result.shopifyAppDescriptionLog = result.shopifyAppDescriptionLog ?? [];
        return result;
    }
    async extractDescription(): Promise<string | undefined> {
        const element = await this.puppetMaster.selectElement(
            this.elements.descriptionElement,
        );
        const description = element ? (await element.text()).trim() : undefined;
        this.watcher.checkWarn(description, {
            msg: `Cant find description element: ${this.elements.descriptionElement}`,
        });
        return description;
    }
    async extractAppName(): Promise<string | undefined> {
        const element = await this.puppetMaster.selectElement(
            this.elements.appNameElement,
        );
        const appName = element ? (await element.text()).trim() : undefined;
        this.watcher.checkError(appName, {
            msg: `Cant find appName element: ${this.elements.descriptionElement}`,
        });
        return appName;
    }
    async extractReviewCount(): Promise<number | undefined> {
        const element = await this.puppetMaster.selectElement(
            this.elements.reviewCountElement,
        );
        const countLine = element ? (await element.text()).trim() : undefined;
        this.watcher.checkError(countLine, {
            msg: `Cant find description element: ${this.elements.reviewCountElement}`,
        });
        return countLine ? Number(countLine.replace(',', '')) : undefined;
    }
    async extractAvgRating(): Promise<number | undefined> {
        const element = await this.puppetMaster.selectElement(
            this.elements.avgRatingElement,
        );
        const rateStr = element
            ? (await element.text()).match(/(\d.\d)/)
            : undefined;
        this.watcher.checkError(rateStr, {
            msg: 'Cant extract float number from this string: ' + rateStr,
        });
        if (rateStr) {
            return rateStr ? Number(rateStr) : undefined;
        } else {
            throw new Error(`This is not a float ${rateStr}`);
        }
    }
    async extractPartnerInfo(): Promise<{
        partnerName: string | undefined;
        partnerURL: string | undefined;
    }> {
        const partnerHrefElement = await this.puppetMaster.selectElement(
            this.elements.partnerHrefElement,
        );
        const partnerHrefText = partnerHrefElement
            ? await partnerHrefElement.hrefAndText()
            : undefined;
        this.watcher.checkError(partnerHrefElement, {
            msg: 'Empty/Undefined `partnerHrefElement`',
        });
        return {
            partnerName: partnerHrefText ? partnerHrefText.text : undefined,
            partnerURL: partnerHrefText ? partnerHrefText.href : undefined,
        };
    }
    extractCurrentAppURL(): string {
        const currentURL = this.puppetMaster.currentURL();
        if (currentURL != this.urls.appLandingPage.toString()) {
            this.watcher.warn({
                msg: 'Current app landing page URL is different from initial url in (config)',
            });
        }
        return currentURL;
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
    async deriveCleanPlanOffer(
        rawOfferString?: ScrapedElement<P,E>,
    ): Promise<string | undefined> {
        if (!rawOfferString) {
            this.watcher.warn({ msg: 'Empty Plan Offer Element' });
            return undefined;
        }
        const splitted = (await rawOfferString.text()).trim().split('\n');
        let cleanedString = '';
        for (const stringPiece of splitted) {
            const trimmedStringPiece = stringPiece.trim();
            if (trimmedStringPiece != '') {
                cleanedString = `${cleanedString}\n${trimmedStringPiece}`;
            }
        }
        return cleanedString;
    }
    async additionalPriceLine(
        priceNameElement: ScrapedElement<P,E>,
    ): Promise<string> {
        const additionalPriceLineElement = (
            await this.puppetMaster.selectElements(
                this.elements.pricingPlans.additionalPriceOptionElementTag,
                priceNameElement, // sometimes there are additional price option,
                // like anual sub price, instead of the usual monthly sub.
            )
        )[0];
        this.watcher.checkWarn(additionalPriceLineElement, {
            msg: '<No `additionalPriceLineElement`>',
        });
        return additionalPriceLineElement
            ? (await additionalPriceLineElement.text()).trim()
            : '';
    }
    async derivePlanPriceName(
        priceNameElement?: ScrapedElement<P,E>,
    ): Promise<{
        planName: string | undefined;
        price: string | undefined;
    }> {
        if (!priceNameElement) {
            return { planName: undefined, price: undefined };
        }
        const puppetMasterFindPrice = async (xpath: string) => {
            return this.watcher.checkWarn(
                await this.puppetMaster.selectElement(xpath, priceNameElement),
                { msg: 'Empty planName or price, xpath' + xpath },
            );
        };
        const pricingPlansXpaths = this.elements.pricingPlans;
        const priceLine = await puppetMasterFindPrice(
            pricingPlansXpaths.priceElementTag,
        );
        const additionalPriceLine =
            await this.additionalPriceLine(priceNameElement);
        const planName = await puppetMasterFindPrice(
            pricingPlansXpaths.nameElementTag,
        );
        return {
            price: (await planName?.text())?.trim(),
            planName: `${(
                await priceLine?.text()
            )?.trim()}\n${additionalPriceLine}`.trim(),
        };
    }
    async derivePlanDetail(
        planElement: ScrapedElement<P,E>,
        appURL: string,
    ): Promise<ShopifyPricingPlan> {
        const puppetMasterFindPlan = async (xpath: string) => {
            return await this.puppetMaster.selectElement(xpath, planElement);

        }
        const planXpaths = this.elements.pricingPlans;
        const { planName, price } = await this.derivePlanPriceName(
            this.watcher.checkWarn(
                await puppetMasterFindPlan(planXpaths.priceNameElementTag),
                { msg: `Empty/There aren't any priceNameElementTag` },
            ),
        );

        const planOffer = await this.deriveCleanPlanOffer(
            await puppetMasterFindPlan(planXpaths.planOfferElementTag),
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
        const planElements = await this.puppetMaster.selectElements(
            this.elements.pricingPlans.planElement,
        );
        return await Promise.all(
            planElements.map(async (plan) => {
                return await this.derivePlanDetail(plan, appURL);
            }),
        );
    }
    async accessPage(): Promise<boolean> {
        this.watcher.info({
            msg: 'Loading: ' + this.urls.appLandingPage.toString(),
        });
        await this.puppetMaster.goto(this.urls.appLandingPage.toString());
        return true;
    }
    async extractDerive(): Promise<ScrapeResult> {
        const partnerBasicInfo = await this.extractBasicPartnerDetail();
        const appDetails = await this.extractAppDetail(
            partnerBasicInfo.shopifyPage,
        );
        const pricingPlans = await this.extractPricingPlans(
            appDetails.shopifyPage,
        );
        const description = await this.extractAppDescriptionLogs();
        return {
            shopifyPartner: [partnerBasicInfo],
            shopifyAppDetail: [appDetails],
            shopifyPricingPlan: pricingPlans,
            shopifyAppDescriptionLog: [description],
        };
    }
    updateScrapeResult(scrapeResult: ScrapeResult): void {
        this.scrapedResults = mergeScrapeResult([
            scrapeResult,
            this.scrapedResults,
        ]);
    }
    async scrape(): Promise<ScrapeResult> {
        await this.accessPage();
        const informationExtracted = await this.extractDerive();
        this.updateScrapeResult(informationExtracted);
        return this.scrapedResults;
    }
}

export default AppLandingPageTrick;
