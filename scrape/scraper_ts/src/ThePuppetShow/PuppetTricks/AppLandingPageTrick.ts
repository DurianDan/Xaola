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
import { getApproxDaysFromPeriodIndicatorString, isPhoneNumber } from './SmallTricks';
import { isEmpty } from 'lodash';

interface PartnerSupportInfo {
    email?: string;
    cellphone?: string;
    unknownInfoType?: string;
}

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
        const rateStr = (await element?.text())?.match(/(\d.\d)/);
        this.watcher.checkError(rateStr, {
            msg: 'Cant extract float number from this string: ' + rateStr,
        });
        if (rateStr) {
            return rateStr ? Number(rateStr) : undefined;
        } else {
            throw new Error(`This is not a float ${rateStr}`);
        }
    }
    async extractPartnerNameUrl(): Promise<{
        partnerName: string | undefined;
        partnerURL: string | undefined;
    }> {
        const partnerHrefElement = await this.puppetMaster.selectElement(
            this.elements.partnerHrefElement,
        );
        const partnerHrefText = await partnerHrefElement?.hrefAndText();
        this.watcher.checkError(partnerHrefElement, {
            msg: 'Empty/Undefined `partnerHrefElement`',
        });
        return {
            partnerName: partnerHrefText?.text,
            partnerURL: partnerHrefText?.href,
        };
    }
    async deriveSupportInfo(
        infoElements: ScrapedElement<P, E>[],
    ): Promise<PartnerSupportInfo> {
        const derivedInfo: PartnerSupportInfo = {};
        const unknownInfos = await Promise.all(
            infoElements.map(async (ele) => await ele.text()),
        );
        for (let i = 0; i < unknownInfos.length; i++) {
            // loop through unknownInfos
            // check if it's email, or cellphone
            // if it is, add it to derivedInfo, pop it out of unknownInfos
            const tmpInfo = unknownInfos[i].trim();
            if (isPhoneNumber(tmpInfo)) {
                derivedInfo.cellphone = tmpInfo;
            } else if (tmpInfo.includes('@')) {
                derivedInfo.email = tmpInfo;
            }
            // Adjust the loop counter to account for the removed element
            i--;
        }
        if (!isEmpty(unknownInfos)) {
            derivedInfo.unknownInfoType = unknownInfos.join('\n');
        }
        return derivedInfo;
    }
    async extractPartnerSupportInfo(): Promise<PartnerSupportInfo> {
        const {
            needsLog: supportInfoIsEmpty,
            checkedObj: foundSupportInfoElements,
        } = this.watcher.checkWarn(
            await this.puppetMaster.selectElements(
                this.elements.partnerInfoBox.supportInfoElements,
            ),
            { msg: "There're not any support info" },
        );
        if (supportInfoIsEmpty) {
            return {};
        }
        return this.deriveSupportInfo(foundSupportInfoElements);
    }
    extractCurrentAppURL(): string {
        const currentURL = this.puppetMaster.currentURL();
        if (currentURL != this.urls.appLandingPage.toString()) {
            this.watcher.warn({
                msg: `Current app URL: ${currentURL} is different from initial URL ${this.urls.appLandingPage}`,
            });
        }
        return currentURL;
    }
    async extractAppDescriptionLogs(): Promise<ShopifyAppDescriptionLog> {
        const scrapedOn = new Date();
        const appCurrentURL = this.extractCurrentAppURL();
        const description = await this.extractDescription();
        return new ShopifyAppDescriptionLog(
            scrapedOn,
            appCurrentURL,
            description,
        );
    }
    async quickSelect(
        selector: string,
        logStr: string,
    ): Promise<undefined | ScrapedElement<P, E>> {
        return this.watcher.checkWarn(
            await this.puppetMaster.selectElement(selector),
            { msg: logStr },
        ).checkedObj;
    }
    async extractPartnerAppsPublished(): Promise<number | undefined> {
        const appsPublishedElement = await this.quickSelect(
            this.elements.partnerInfoBox.appsPublishedElement,
            '<Empty Partner appsPublishedElement>',
        );
        const foundNumbers = (await appsPublishedElement?.text())
            ?.match(/\d+/g)
            ?.slice(0, 2)
            ?.join('');
        return foundNumbers ? Number(foundNumbers) : undefined;
    }
    async extractPartnerAverageRating(): Promise<number | undefined> {
        const ratingElement = await this.quickSelect(
            this.elements.partnerInfoBox.averageRatingElement,
            '<Empty Partner averageRatingElement>',
        );
        const foundNumber = (await ratingElement?.text())?.match(/\d.\d/g)?.[0];
        return foundNumber ? Number(foundNumber) : undefined;
    }
    async extractPartnerBusinessWebsite(): Promise<string | undefined> {
        const businessWebsiteTag = await this.quickSelect(
            this.elements.partnerInfoBox.websiteTagAElement,
            '<Empty Partner websiteTagAElement>',
        );
        return await businessWebsiteTag?.href();
    }
    async extractPartnerYearsBuiltApps(): Promise<number | undefined> {
        const yearsBuiltAppsElement = await this.quickSelect(
            this.elements.partnerInfoBox.yearsBuiltAppsElement,
            "<Empty Partner yearsBuiltAppsElement>"
            );
            return getApproxDaysFromPeriodIndicatorString(
                await yearsBuiltAppsElement?.text()
                )
            }
    async extractPartnerLocation(): Promise<string|undefined>{
        const locationElement = await this.quickSelect(
            this.elements.partnerInfoBox.locationElement,
            "<Empty Partner locationElement"
        );
        return (await locationElement?.text())?.trim()
    }
    async extractPartnerDetail(): Promise<ShopifyPartner> {
        const partnerInfo = await this.extractPartnerNameUrl();
        const {
            email, cellphone, unknownInfoType
        } = await this.extractPartnerSupportInfo();
        return new ShopifyPartner(
            new Date(),
            partnerInfo.partnerName,
            partnerInfo.partnerURL,
            await this.extractPartnerAppsPublished(),
            await this.extractPartnerAverageRating(),
            await this.extractPartnerBusinessWebsite(),
            await this.extractPartnerLocation(),
            email, cellphone,
            await this.extractPartnerYearsBuiltApps(),
            unknownInfoType
        );
    }
    async extractAppDetail(partnerPage?: string): Promise<ShopifyAppDetail> {
        return new ShopifyAppDetail(
            new Date(),
            this.extractCurrentAppURL(),
            await this.extractAppName(),
            await this.extractReviewCount(),
            await this.extractAvgRating(),
            partnerPage,
        );
    }
    async deriveCleanPlanOffer(
        rawOfferString?: ScrapedElement<P, E>,
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
        priceNameElement: ScrapedElement<P, E>,
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
        priceNameElement?: ScrapedElement<P, E>,
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
            ).checkedObj;
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
        planElement: ScrapedElement<P, E>,
        appURL?: string,
    ): Promise<ShopifyPricingPlan> {
        const puppetMasterFindPlan = async (xpath: string) => {
            return await this.puppetMaster.selectElement(xpath, planElement);
        };
        const planXpaths = this.elements.pricingPlans;
        const { planName, price } = await this.derivePlanPriceName(
            this.watcher.checkWarn(
                await puppetMasterFindPlan(planXpaths.priceNameElementTag),
                { msg: `Empty/There aren't any priceNameElementTag` },
            ).checkedObj,
        );

        const planOffer = await this.deriveCleanPlanOffer(
            await puppetMasterFindPlan(planXpaths.planOfferElementTag),
        );
        return new ShopifyPricingPlan(
            new Date(),
            planName,
            price,
            planOffer,
            appURL,
        );
    }
    async extractPricingPlans(appURL?: string): Promise<ShopifyPricingPlan[]> {
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
        const partnerBasicInfo = await this.extractPartnerDetail();
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
