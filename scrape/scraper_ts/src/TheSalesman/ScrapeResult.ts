import * as scrapedTables from './ScrapedTable';

interface ScrapeResult {
    shopifyPartner?: Array<scrapedTables.ShopifyPartner>;
    shopifyAppCategory?: Array<scrapedTables.ShopifyAppCategory>;
    shopifyAppDescriptionLog?: Array<scrapedTables.ShopifyAppDescriptionLog>;
    shopifyAppDetail?: Array<scrapedTables.ShopifyAppDetail>;
    shopifyAppReviews?: Array<scrapedTables.ShopifyAppReview>;
    shopifyCategoryRankLog?: Array<scrapedTables.ShopifyCategoryRankLog>;
    shopifyCommunityUserStats?: Array<scrapedTables.ShopifyCommunityUserStats>;
    shopifyCommunityUserStatsLog?: Array<scrapedTables.ShopifyCommunityUserStatsLog>;
    shopifyPricingPlan?: Array<scrapedTables.ShopifyPricingPlan>;
}

export default ScrapeResult;
