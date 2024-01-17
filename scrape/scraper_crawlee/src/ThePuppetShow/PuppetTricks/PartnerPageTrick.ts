import { ShopifyPageURL } from "../../TheSalesman/config/pages";
import { PuppetMaster } from "../PuppetMaster";
import BaseTrick from "./BaseTrick";
import * as ElementsCfg from '../../TheSalesman/config/elements';
import RawScrapeResult from "../../TheSalesman/ScrapedResult/RawScrapeResult";
import { BaseWatcher } from "../../TheWatcher/BaseWatcher";
import { ShopifyAppDetail } from "../../TheSalesman/ScrapedTable";


export default class PartnerPageTrick<P,E> implements BaseTrick<P,E>{
  public urls: ShopifyPageURL;
  public elements = ElementsCfg.shopifyPartnerElements;
  constructor(
      partnerUrlId: string,
      public puppetMaster: PuppetMaster<P, E>,
      public scrapedResults: RawScrapeResult,
      public watcher: BaseWatcher,
  ) {
      this.puppetMaster = puppetMaster;
      this.urls = new ShopifyPageURL({ partnerUrlId });
      this.scrapedResults = this.checkScrapedResults(scrapedResults);
      this.watcher = watcher;
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
    return true;
  }
  async extractAvgRating(): Promise<number>{}
  async extractAppCount(): Promise<number>{}
  async extractAppsElements(): Promise<E[]>{}
  async extractAppInfoFromIndividualAppElement(appElement: E): Promise<ShopifyAppDetail>{}
  async extractAppsInfo(): Promise<ShopifyAppDetail[]>{}
  async extractDerive(): Promise<RawScrapeResult> {} 
  updateScrapeResult(scrapeResult: RawScrapeResult): void {} 
  async scrape(): Promise<RawScrapeResult> {}

}

//=============================TECH-DEBT==================================
/* The PartnerPageTrick is only tested with NoobMaster,
ComplexMaster still using XPATH as element selector,
when there's not parent element parsed */