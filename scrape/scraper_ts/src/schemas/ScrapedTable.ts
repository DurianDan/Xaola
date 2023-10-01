import BaseScrapedTable from './BaseScrapedTable';

type HttpUrl = string;
type scrapeBlocks = '<error>' | '<not-permitted>' | '<not-scraped-yet>';

class ShopifyProvider extends BaseScrapedTable {
    name: string | scrapeBlocks = '<not-scraped-yet>';
    shopify_page: HttpUrl | scrapeBlocks = '<not-scraped-yet>';
    apps_published: number | scrapeBlocks = '<not-scraped-yet>';
    avg_rating: number | scrapeBlocks = '<not-scraped-yet>';
}

class ShopifyAppCategory extends BaseScrapedTable {
    name: string | scrapeBlocks = '<not-scraped-yet>';
    parent_category_id: HttpUrl | number | null | scrapeBlocks = null;
    shopify_page: HttpUrl | scrapeBlocks = '<not-scraped-yet>';
    category_type: string | scrapeBlocks = '<not-scraped-yet>';
}
class ShopifyAppDetail extends BaseScrapedTable {
    shopify_page: HttpUrl | scrapeBlocks = '<not-scraped-yet>';
    name: string | scrapeBlocks = '<not-scraped-yet>';
    review_count: number | scrapeBlocks = '<not-scraped-yet>';
    provider_id: number | HttpUrl | scrapeBlocks = '<not-scraped-yet>';
    category_id: number | HttpUrl | null | scrapeBlocks = null;
}
class ShopifyAppReviews extends BaseScrapedTable {
    constructor() {
        super();
        this._eqFields = ['reviewer', 'location', 'content'];
    }

    app_id: number | HttpUrl | scrapeBlocks = '<not-scraped-yet>';
    last_updated_page: number | scrapeBlocks = '<not-scraped-yet>';
    reviewer: string | scrapeBlocks = '<not-scraped-yet>';
    location: string | scrapeBlocks = '<not-scraped-yet>';
    content: string | scrapeBlocks = '<not-scraped-yet>';
    days_spend_on_app: number | scrapeBlocks = '<not-scraped-yet>';
    rating: number | scrapeBlocks = '<not-scraped-yet>';
    review_date: string | scrapeBlocks = '<not-scraped-yet>';
}
class ShopifyPricingPlan extends BaseScrapedTable {
    constructor() {
        super();
        this._eqFields = ['plan_name', 'price', 'offer'];
    }

    plan_name: string | scrapeBlocks = '<not-scraped-yet>';
    price: string | scrapeBlocks = '<not-scraped-yet>';
    offer: string | scrapeBlocks = '<not-scraped-yet>';
    app_id: number | HttpUrl | scrapeBlocks = '<not-scraped-yet>';
}
class ShopifyCategoryRankLog extends BaseScrapedTable {
    constructor() {
        super();
        this._eqFields = ['rank', 'app_id', 'category_id'];
    }

    category_id: number | HttpUrl | scrapeBlocks = '<not-scraped-yet>';
    rank: number | scrapeBlocks = '<not-scraped-yet>';
    app_id: number | HttpUrl | scrapeBlocks = '<not-scraped-yet>';
}
class ShopifyAppDescriptionLog extends BaseScrapedTable {
    constructor() {
        super();
        this._eqFields = ['description'];
    }

    app_id: number | HttpUrl | scrapeBlocks = '<not-scraped-yet>';
    description: string | scrapeBlocks = '<not-scraped-yet>';
}

class ShopifyCommunityUserStats extends BaseScrapedTable {
    constructor() {
        super();
        this._eqFields = ['community_user_page'];
    }
    community_user_page: HttpUrl | scrapeBlocks = '<not-scraped-yet>';
    community_user_name: string | scrapeBlocks = '<not-scraped-yet>';
    community_user_type: string | scrapeBlocks = '<not-scraped-yet>';
    posts_count: number | scrapeBlocks = '<not-scraped-yet>';
    solutions_count: number | scrapeBlocks = '<not-scraped-yet>';
    likes_count: number | scrapeBlocks = '<not-scraped-yet>';
    topics_started_count: number | scrapeBlocks = '<not-scraped-yet>';
    provider_id: number | null | HttpUrl | scrapeBlocks = null;
}

class ShopifyCommunityUserStatsLog extends BaseScrapedTable {
    constructor() {
        super();
        this._eqFields = [
            'community_user_id',
            'posts_count',
            'solutions_count',
            'likes_count',
            'topics_started_count',
        ];
    }
    community_user_id: number | scrapeBlocks = '<not-scraped-yet>';
    posts_count: number | scrapeBlocks = '<not-scraped-yet>';
    solutions_count: number | scrapeBlocks = '<not-scraped-yet>';
    likes_count: number | scrapeBlocks = '<not-scraped-yet>';
    topics_started_count: number | scrapeBlocks = '<not-scraped-yet>';
}

export {
    ShopifyProvider,
    ShopifyAppCategory,
    ShopifyAppDescriptionLog,
    ShopifyAppDetail,
    ShopifyAppReviews,
    ShopifyCategoryRankLog,
    ShopifyCommunityUserStats,
    ShopifyCommunityUserStatsLog,
    ShopifyPricingPlan,
    HttpUrl,
};
