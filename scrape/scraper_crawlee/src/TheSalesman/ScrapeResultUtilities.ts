import IndexedScrapeResult from './ScrapedResult/IndexedScrapedResult';
import RawScrapeResult from './ScrapedResult/RawScrapeResult';
import {
  HttpUrl,
  ShopifyAppDetail,
  ShopifyCategoryRankLog,
} from './ScrapedTable';

export function mergeScrapeResult(
  resultsToMerge: RawScrapeResult[],
): Required<RawScrapeResult> {
  const mergedResult: Required<RawScrapeResult> = {
    shopifyPartner: [],
    shopifyAppCategory: [],
    shopifyAppDescriptionLog: [],
    shopifyAppDetail: [],
    shopifyAppReviews: [],
    shopifyCategoryRankLog: [],
    shopifyCommunityUserStats: [],
    shopifyCommunityUserStatsLog: [],
    shopifyPricingPlan: [],
  };
  resultsToMerge.forEach((result) => {
    mergedResult.shopifyPartner?.push(...(result.shopifyPartner ?? []));
    mergedResult.shopifyAppCategory?.push(...(result.shopifyAppCategory ?? []));
    mergedResult.shopifyAppDescriptionLog?.push(
      ...(result.shopifyAppDescriptionLog ?? []),
    );
    mergedResult.shopifyAppDetail?.push(...(result.shopifyAppDetail ?? []));
    mergedResult.shopifyAppReviews?.push(...(result.shopifyAppReviews ?? []));
    mergedResult.shopifyCategoryRankLog?.push(
      ...(result.shopifyCategoryRankLog ?? []),
    );
    mergedResult.shopifyCommunityUserStats?.push(
      ...(result.shopifyCommunityUserStats ?? []),
    );
    mergedResult.shopifyCommunityUserStatsLog?.push(
      ...(result.shopifyCommunityUserStatsLog ?? []),
    );
    mergedResult.shopifyPricingPlan?.push(...(result.shopifyPricingPlan ?? []));
  });
  return mergedResult;
}

export function appRankFromAppDetail(
  appDetail: ShopifyAppDetail,
  rank: number,
  categoryId: HttpUrl,
): ShopifyCategoryRankLog {
  return new ShopifyCategoryRankLog(
    appDetail.scrapedAt,
    categoryId,
    rank,
    appDetail.id as string,
  );
}

export function getIndexedScrapedResult(
  rawScrapedResult: Required<RawScrapeResult>,
): IndexedScrapeResult {
  const indexed = {};
  const shopifyEntities: (keyof IndexedScrapeResult)[] = [
    'shopifyPartner',
    'shopifyAppCategory',
    'shopifyAppDetail',
  ];
  for (const entityName of shopifyEntities) {
    (indexed as any)[entityName] = rawScrapedResult[entityName].map(
      (scrapedResult) => {
        const indexedResult = Object();
        indexedResult.set(scrapedResult.shopifyPage, scrapedResult);
        return indexedResult;
      },
    );
  }
  return indexed as IndexedScrapeResult;
}

/**
 * Return the unique substring part of an url,
 * to be used as an id
 * @param {any} url:string
 * @returns {any}
 */
export function urlToId(url: string | undefined): string | undefined {
  if (url === undefined) {
    return undefined;
  }
  const paramIdx = url.indexOf('?');
  const urlWithoutParams = paramIdx > 0 ? url.slice(0, paramIdx) : url;
  return urlWithoutParams.split('/').slice(-1)[0];
}
