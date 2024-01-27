import RawScrapeResult from '../../TheSalesman/ScrapedResult/RawScrapeResult';
import { ShopifyPageURL } from '../../TheSalesman/config/pages';
// import * as ElementsCfg from '../../TheSalesman/config/elements';
import {
  ShopifyAppDetail,
  HttpUrl,
  ShopifyCategoryRankLog,
} from '../../TheSalesman/ScrapedTable';
import BaseTrick from './BaseTrick';
import { BaseWatcher } from '../../TheWatcher/BaseWatcher';
import {
  appRankFromAppDetail,
  mergeScrapeResult,
  urlToId,
} from '../../TheSalesman/ScrapeResultUtilities';
import { PuppetMaster } from '../PuppetMaster';
import ScrapedElement from '../ScrapedElement.ts';
import { fancyCategoryElements } from '../../TheSalesman/config/elements';

class FancyCategoryTrick<P, E> implements BaseTrick<P, E> {
  public urls: ShopifyPageURL;
  public elements = fancyCategoryElements;
  constructor(
    categoryUrlId: string,
    public puppetMaster: PuppetMaster<P, E>,
    public scrapedResults: RawScrapeResult,
    public watcher: BaseWatcher,
  ) {
    this.puppetMaster = puppetMaster;
    this.urls = new ShopifyPageURL({ categoryUrlId });
    this.scrapedResults = this.checkScrapedResults(scrapedResults);
    this.watcher = watcher;
  }
  checkScrapedResults(result: RawScrapeResult): RawScrapeResult {
    this.watcher.checkInfo(result, {
      msg: 'Empty `ScrapeResult`, will return a new scrape result',
    });
    result.shopifyAppDetail = result.shopifyAppDetail ?? [];
    result.shopifyCategoryRankLog = result.shopifyCategoryRankLog ?? [];
    return result;
  }
  async accessPage(): Promise<boolean> {
    await this.puppetMaster.goto(this.urls.appCategoryPage.toString());
    return true;
  }
  async extractAppRankElements(): Promise<
    { element: ScrapedElement<P, E>; elementIdx: number }[]
  > {
    const elements = await this.puppetMaster.selectElements(
      this.elements.appCateogryInfo.positions,
    );
    return elements.map((value, index) => {
      return {
        element: value,
        elementIdx: index,
      };
    });
  }
  async extractLinkNameFromRankElement(element: ScrapedElement<P, E>): Promise<{
    appName: string | undefined;
    appLink: HttpUrl | undefined;
  }> {
    const innerTagA = this.watcher.checkError(
      await this.puppetMaster.selectElement(
        this.elements.appCateogryInfo.innerTagASelector,
        element,
      ),
      { msg: 'Cant find innerTagA of each App/Rank element' },
    ).checkedObj;
    const { href: appLink, text: appName } = innerTagA
      ? await innerTagA.hrefAndText()
      : { href: undefined, text: undefined };
    return {
      appLink: appLink?.split('?')[0],
      appName: appName?.trim(),
    };
  }
  async extractAvgRatingFromRankElement(
    element: ScrapedElement<P, E>,
  ): Promise<number | undefined> {
    const ratingElement = this.watcher.checkError(
      await this.puppetMaster.selectElement(
        this.elements.appCateogryInfo.innerAvgRatingSelector,
        element,
      ),
      { msg: 'Cant find ratingElement inside App/Rank Elements' },
    ).checkedObj;
    const ratingString = (await ratingElement?.text())?.trim();
    // '3.4\n               out of 5 stars'
    return Number(ratingString?.split('\n')[0]);
  }
  async extractReviewCountFromRankElement(
    element: ScrapedElement<P, E>,
  ): Promise<number> {
    const reviewCountElement = this.watcher.checkError(
      await this.puppetMaster.selectElement(
        this.elements.appCateogryInfo.innerReviewCountSelector,
        element,
      ),
      { msg: 'Cant find reviewCountElement, inside App/Rank element' },
    ).checkedObj;
    // '56 total reviews'
    const reviewCountString = await reviewCountElement?.text();
    if (!reviewCountString || reviewCountString.includes('No reviews')) {
      return 0;
    }
    const foundNumberPart = reviewCountString.match(/\d+(\.\d+)?/g);
    return foundNumberPart ? Number(foundNumberPart) : 0;
  }
  async extractAppDetailFromRankElement(
    element: ScrapedElement<P, E>,
  ): Promise<ShopifyAppDetail> {
    const { appLink, appName } =
      await this.extractLinkNameFromRankElement(element);
    const reviewCount = await this.extractReviewCountFromRankElement(element);
    const avgRating =
      reviewCount > 0
        ? await this.extractAvgRatingFromRankElement(element)
        : undefined;
    return new ShopifyAppDetail(
      new Date(),
      appLink,
      appName,
      reviewCount,
      avgRating,
    );
  }
  async extractAppRankInfo({
    elementIdx,
    element,
  }: {
    elementIdx: number;
    element: ScrapedElement<P, E>;
  }): Promise<{
    appDetail: ShopifyAppDetail;
    appRank: ShopifyCategoryRankLog;
  }> {
    const appDetail = await this.extractAppDetailFromRankElement(element);
    return {
      appDetail,
      appRank: appRankFromAppDetail(
        appDetail,
        elementIdx + 1, // rank is 1-indexed
        urlToId(this.urls.appCategoryPage.toString()) as string,
      ),
    };
  }
  async extractDerive(): Promise<{
    shopifyAppDetail: ShopifyAppDetail[];
    shopifyCategoryRankLog: ShopifyCategoryRankLog[];
  }> {
    const appRankElements = await this.extractAppRankElements();
    this.watcher.info({
      msg: `There are ${appRankElements.length} appRankElements`,
    });
    const shopifyAppDetail: ShopifyAppDetail[] = [];
    const shopifyCategoryRankLog: ShopifyCategoryRankLog[] = [];
    await Promise.all(
      appRankElements.map(async (elementIdx) => {
        const { appDetail, appRank } =
          await this.extractAppRankInfo(elementIdx);
        shopifyAppDetail.push(appDetail);
        shopifyCategoryRankLog.push(appRank);
      }),
    );
    return { shopifyAppDetail, shopifyCategoryRankLog };
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

export default FancyCategoryTrick;
//=============================TECH-DEBT==================================
/* The FancyCategoryTrick is only tested with NoobMaster,
ComplexMaster still using XPATH as element selector,
when there's not parent element parsed */
