import * as scrapedTables from './ScrapedTable';

interface ScrapeResult {
    shpfPartner?: Array<scrapedTables.ShopifyPartner>;
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
