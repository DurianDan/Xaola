import RawScrapeResult from '../../TheSalesman/ScrapedResult/RawScrapeResult';
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
import { PuppetMaster } from '../PuppetMaster';
import ScrapedElement from '../ScrapedElement.ts';
import {
    getApproxDaysFromPeriodIndicatorString,
    isPhoneNumber,
} from './SmallTricks';
import { isEmpty } from 'lodash';

interface PartnerSupportInfo {
    email?: string;
    cellphone?: string;
    unknownInfoType?: string[];
}

class AppLandingPageTrick<P, E> implements BaseTrick<P, E> {
    public urls: ShopifyPageURL;
    public elements = ElementsCfg.shopifyAppElements;
    constructor(
        appUrlId: string,
        public puppetMaster: PuppetMaster<P, E>,
        public scrapedResults: RawScrapeResult,
        public watcher: BaseWatcher,
    ) {
        this.puppetMaster = puppetMaster;
        this.urls = new ShopifyPageURL({ appUrlId });
        this.scrapedResults = this.checkScrapedResults(scrapedResults);
        this.watcher = watcher;
    }
    checkScrapedResults(result: RawScrapeResult): RawScrapeResult {
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
        const rateLine = await element?.text();
        const { needsLog, checkedObj: foundRating } = this.watcher.checkError(
            rateLine?.match(/(\d.\d)/),
            { msg: 'Cant extract float number from this string: ' + rateLine },
        );
        return needsLog ? undefined : Number(foundRating?.[0]);
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
            partnerName: partnerHrefText?.text?.trim(),
            partnerURL: partnerHrefText?.href,
        };
    }
    async deriveSupportInfo(
        infoElements: ScrapedElement<P, E>[],
    ): Promise<PartnerSupportInfo> {
        const derivedInfo: PartnerSupportInfo = {};
        const foundInfos = await Promise.all(
            infoElements.map(async (ele) => (await ele.text()).trim()),
        );
        const unknownInfos: string[] = [];
        foundInfos.forEach((info) => {
            // loop through unknownInfos
            // check if it's email, or cellphone
            // if it is, add it to derivedInfo
            // if not, add it to the unknownInfos
            if (isPhoneNumber(info)) {
                derivedInfo.cellphone = info;
            } else if (info.includes('@')) {
                derivedInfo.email = info;
            } else {
                unknownInfos.push(info);
            }
        });
        if (!isEmpty(unknownInfos)) {
            derivedInfo.unknownInfoType = unknownInfos;
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
            { msg: "There's not any support info" },
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
        parentElement?: ScrapedElement<P, E>,
    ): Promise<undefined | ScrapedElement<P, E>> {
        return this.watcher.checkWarn(
            await this.puppetMaster.selectElement(selector, parentElement),
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
            '<Empty Partner yearsBuiltAppsElement>',
        );
        const daysSpentBuidingApps = getApproxDaysFromPeriodIndicatorString(
            await yearsBuiltAppsElement?.text(),
        );
        return daysSpentBuidingApps ? daysSpentBuidingApps / 365.5 : undefined;
    }
    async extractPartnerLocation(): Promise<string | undefined> {
        const locationElement = await this.quickSelect(
            this.elements.partnerInfoBox.locationElement,
            '<Empty Partner locationElement',
        );
        return (await locationElement?.text())?.trim();
    }
    async extractPartnerDetail(): Promise<ShopifyPartner> {
        const { partnerName, partnerURL } = await this.extractPartnerNameUrl();
        const { email, cellphone, unknownInfoType } =
            await this.extractPartnerSupportInfo();
        const partnerDetail = new ShopifyPartner(
            new Date(),
            partnerName,
            partnerURL,
            await this.extractPartnerAppsPublished(),
            await this.extractPartnerAverageRating(),
            await this.extractPartnerBusinessWebsite(),
            await this.extractPartnerLocation(),
            email,
            cellphone,
            await this.extractPartnerYearsBuiltApps(),
            unknownInfoType,
        );
        return partnerDetail;
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
    async derivePlanAdditionalPrice(
        planElement: ScrapedElement<P, E>,
        planNameToExclude: string | undefined,
    ): Promise<undefined | string> {
        const foundNameAndOrAddtionalPriceElements =
            await this.puppetMaster.selectElements(
                this.elements.pricingPlans
                    .nameElementAndOrAdditionalPriceOptionElement,
                planElement,
            );
        if (!isEmpty(foundNameAndOrAddtionalPriceElements)) {
            return undefined;
        }
        if (planNameToExclude) {
            for (const element of foundNameAndOrAddtionalPriceElements) {
                const elementText = await element.text();
                if (!elementText.includes(planNameToExclude.trim())) {
                    return elementText.trim();
                }
            }
            return undefined;
        } else {
            return foundNameAndOrAddtionalPriceElements.join('\n');
        }
    }
    async derivePlanDetail(
        planElement: ScrapedElement<P, E>,
        appURL?: string,
    ): Promise<ShopifyPricingPlan> {
        const nameElement = await this.quickSelect(
            this.elements.pricingPlans.nameElement,
            '<Empty Plan nameElement>',
            planElement,
        );
        const planOfferElement = await this.quickSelect(
            this.elements.pricingPlans.planOfferElement,
            '<Empty Plan planOfferElement>',
            planElement,
        );
        const priceElement = await this.quickSelect(
            this.elements.pricingPlans.priceElement,
            '<Empty Plan priceElement>',
            planElement,
        );
        const planName = (await nameElement?.text())?.trim();
        return new ShopifyPricingPlan(
            new Date(),
            planName,
            (await priceElement?.text())?.trim(),
            (await planOfferElement?.text())?.trim(),
            appURL,
            await this.derivePlanAdditionalPrice(planElement, planName),
        );
    }
    async extractPricingPlans(appURL?: string): Promise<ShopifyPricingPlan[]> {
        const planElements = await this.puppetMaster.selectElements(
            this.elements.pricingPlans.pricingPlanElements,
        );
        this.watcher.info({
            msg: `there are ${planElements.length} planElements`,
        });
        return await Promise.all(
            planElements.map(async (plan) => {
                return await this.derivePlanDetail(plan, appURL);
            }),
        );
    }
    async accessPage(): Promise<boolean> {
        await this.puppetMaster.goto(this.urls.appLandingPage.toString());
        return true;
    }
    async extractDerive(): Promise<RawScrapeResult> {
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
    updateScrapeResult(scrapeResult: RawScrapeResult): void {
        this.scrapedResults = mergeScrapeResult([
            scrapeResult,
            this.scrapedResults,
        ]);
    }
    async scrape(): Promise<RawScrapeResult> {
        await this.accessPage();
        const informationExtracted = await this.extractDerive();
        this.updateScrapeResult(informationExtracted);
        return this.scrapedResults;
    }
}

export default AppLandingPageTrick;
