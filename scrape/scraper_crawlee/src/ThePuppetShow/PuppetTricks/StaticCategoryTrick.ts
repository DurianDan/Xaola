import RawScrapeResult from '../../TheSalesman/ScrapedResult/RawScrapeResult';
import { ShopifyCategoryRankLog } from '../../TheSalesman/ScrapedTable';
import { shopifyStaticCategoryElements } from '../../TheSalesman/config/elements';
import { BaseWatcher } from '../../TheWatcher/BaseWatcher';
import { PuppetMaster } from '../PuppetMaster';
import ScrapedElement from '../ScrapedElement.ts';
import FancyCategoryTrick from './FancyCategoryTrick';

class StaticCategoryTrick<P, E> extends FancyCategoryTrick<P, E> {
  public override elements = shopifyStaticCategoryElements;
  constructor(
    categoryUrlId: string,
    puppetMaster: PuppetMaster<P, E>,
    scrapedResults: RawScrapeResult,
    watcher: BaseWatcher,
    public appsPerPage: number,
  ) {
    super(categoryUrlId, puppetMaster, scrapedResults, watcher);
    this.appsPerPage = appsPerPage;
  }
  async getPaginationTagAElements(): Promise<ScrapedElement<P, E>[]> {
    return await this.puppetMaster.selectElements(
      this.elements.paginationButtons,
    );
  }
  async extractCurrentPageNum(): Promise<number> {
    const foundPaginationButton = await this.getPaginationTagAElements();
    for (const tagA of foundPaginationButton) {
      if ((await tagA.getAttribute('aria-label')).includes('Current Page')) {
        return Number((await tagA.text()).trim());
      }
    }
    return 1;
  }
  async inferRanksBeforeCurrentPage(): Promise<number> {
    const currentPage = await this.extractCurrentPageNum();
    return (currentPage - 1) * this.appsPerPage;
  }

  formatPaginationURL(paginationURL: string): string {
    const tmpURL = new URL(paginationURL);
    let pageURL = tmpURL.origin + tmpURL.pathname;
    const pageParam = tmpURL.searchParams.get('page');
    if (pageParam) {
      pageURL = `${pageURL}?page=${pageParam}`;
    }
    return pageURL;
  }
  async extractPageURLs(): Promise<string[]> {
    const foundPaginationButton = await this.getPaginationTagAElements();
    return await Promise.all(
      foundPaginationButton.map(async (tagA) =>
        this.formatPaginationURL(await tagA.getAttribute('href')),
      ),
    );
  }
  async addRanksBeforeCurrentPage(
    scrapedAppsRanks: ShopifyCategoryRankLog[],
  ): Promise<ShopifyCategoryRankLog[]> {
    const ranksBefore = await this.inferRanksBeforeCurrentPage();
    scrapedAppsRanks.forEach((appRank) => {
      if (appRank.rank) {
        appRank.rank += ranksBefore;
      }
    })
    return scrapedAppsRanks;
  }
  override async scrape(): Promise<RawScrapeResult> {
    await this.accessPage();
    const informationExtracted = await this.extractDerive();
    informationExtracted.shopifyCategoryRankLog =
      await this.addRanksBeforeCurrentPage(
        informationExtracted.shopifyCategoryRankLog,
      );
    this.updateScrapeResult(informationExtracted);
    return this.scrapedResults;
  }
}

export default StaticCategoryTrick;
