import { ShopifyPageURL } from "../../TheSalesman/config/pages";
import { PuppetMaster } from "../PuppetMaster";
import BaseTrick from "./BaseTrick";
import * as ElementsCfg from '../../TheSalesman/config/elements';
import RawScrapeResult from "../../TheSalesman/ScrapedResult/RawScrapeResult";
import { BaseWatcher } from "../../TheWatcher/BaseWatcher";
import { ShopifyAppDetail, ShopifyPartner } from "../../TheSalesman/ScrapedTable";
import { mergeScrapeResult } from "../../TheSalesman/ScrapeResultUtilities";

export default class PartnerPageTrick<P,E> implements BaseTrick<P,E>{
  public urls: ShopifyPageURL;
  public elements = ElementsCfg.shopifyPartnerElements;
  constructor(
      partnerUrlId: string,
      public puppetMaster: PuppetMaster<P, E>,
      public scrapedResults: RawScrapeResult,
      public watcher: BaseWatcher,
      public appsInfoExtractor: BaseTrick<P, E>,
  ) {
      this.puppetMaster = puppetMaster;
      this.urls = new ShopifyPageURL({ partnerUrlId });
      this.scrapedResults = this.checkScrapedResults(scrapedResults);
      this.watcher = watcher;
      this.appsInfoExtractor = this.configAppsInfoExtractor(appsInfoExtractor);
  }
  configAppsInfoExtractor(appsInfoTrick: BaseTrick<P,E>):BaseTrick<P,E>{
    appsInfoTrick.puppetMaster = this.puppetMaster
    return appsInfoTrick
  }
  checkScrapedResults(result: RawScrapeResult): RawScrapeResult {
    this.watcher.checkInfo(result, {
        msg: 'Empty `ScrapeResult`, will return a new scrape result',
    });
    result.shopifyAppDetail = result.shopifyAppDetail ?? [];
    result.shopifyPartner = result.shopifyPartner ?? [];
    return result;
  }
  async accessPage(): Promise<boolean> {
    this.puppetMaster.goto(this.urls.appPartnerLandingPage.toString());
    this.configAppsInfoExtractor(this.appsInfoExtractor)
    return true;
  }
  async extractAvgRating(): Promise<number>{
    const foundRatingLine = await (await this.puppetMaster.selectElement(
      this.elements.avgRatingElement
    ))?.text()
    if (!foundRatingLine){return 0}
    return Number(foundRatingLine.split("app")[0].trim());
  }
  async extractAppCount(): Promise<number>{
    const foundAppCountLine = await (await this.puppetMaster.selectElement(
      this.elements.avgRatingElement
    ))?.text()
    if (!foundAppCountLine || foundAppCountLine.includes("No reviews")){
      return 0
    }
    return Number(foundAppCountLine.split("review")[0].trim());
  }
  async extractAppsInfo(): Promise<ShopifyAppDetail[]>{
    const foundAppsDetail = (await this.appsInfoExtractor.scrape()).shopifyAppDetail;
    this.watcher.checkWarn(
      foundAppsDetail,
      {msg: `Is the parsed \`appsInfoExtractor\` valid ? There isn't any apps details extracted, partner ${this.urls.appPartnerLandingPage}`}
    )
    return foundAppsDetail??[]
  }
  async extractPartnerName(): Promise<string|undefined>{
    const foundNameLine = await (await this.puppetMaster.selectElement(
      this.elements.nameLineElement
    ))?.text()
    return foundNameLine?.trim();
  }
  async extractPartnerInfo(): Promise<ShopifyPartner>{
    const partnerName = await this.extractPartnerName();
    const avgRating = await this.extractAvgRating()
    const appCount = await this.extractAppCount()
    return new ShopifyPartner(
      new Date(), partnerName, this.urls.appPartnerLandingPage.toString(),appCount,avgRating
    )
  }
  async extractDerive(): Promise<RawScrapeResult> {
    const foundPartner = await this.extractPartnerInfo();
    const appsInfo = await this.extractAppsInfo()
    return {
      shopifyAppDetail: appsInfo,
      shopifyPartner: [foundPartner]
    }
  } 
  updateScrapeResult(scrapeResult: RawScrapeResult): void {
    this.scrapedResults = mergeScrapeResult([
      this.scrapedResults, scrapeResult
    ])
  }
  async scrape(): Promise<RawScrapeResult> {
    this.updateScrapeResult(
      await this.extractDerive()  
    )
    return this.scrapedResults
  }
}

//=============================TECH-DEBT==================================
/* The PartnerPageTrick is only tested with NoobMaster,
ComplexMaster still using XPATH as element selector,
when there's not parent element parsed */