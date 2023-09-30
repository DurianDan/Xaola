import * as scrapedTables from './ScrapedTable';

interface ScrapeResult {
  shpfProvider?: Array<scrapedTables.ShopifyProvider>;
  shpfAppCategory?: Array<scrapedTables.ShopifyAppCategory>;
  shpfAppDescriptionLog?: Array<scrapedTables.ShopifyAppDescriptionLog>;
  shpfAppDetail?: Array<scrapedTables.ShopifyAppDetail>;
  shpfAppReviews?: Array<scrapedTables.ShopifyAppReviews>;
  shpfCategoryRankLog?: Array<scrapedTables.ShopifyCategoryRankLog>;
  shpfCommunityUserStats?: Array<scrapedTables.ShopifyCommunityUserStats>;
  shpfCommunityUserStatsLog?: Array<scrapedTables.ShopifyCommunityUserStatsLog>;
  shpfPricingPlan?: Array<scrapedTables.ShopifyPricingPlan>;
}

export default ScrapeResult;
