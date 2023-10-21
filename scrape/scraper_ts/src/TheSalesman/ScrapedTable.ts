import BaseScrapedTable from './BaseScrapedTable';

type HttpUrl = string;
type scrapeBlocks = '<error>' | '<not-permitted>' | '<not-scraped-yet>';

class ShopifyPartner extends BaseScrapedTable {
    constructor(
        public id: number | null = null,
        public createdOn: Date,
        public name: string | scrapeBlocks = '<not-scraped-yet>',
        public shopifyPage: HttpUrl | scrapeBlocks = '<not-scraped-yet>',
        public appsPublished: number | scrapeBlocks = '<not-scraped-yet>',
        public avgRating: number | scrapeBlocks = '<not-scraped-yet>',
    ) {
        super(id, createdOn);
        this.name = name;
        this.shopifyPage = shopifyPage;
        this.appsPublished = appsPublished;
        this.avgRating = avgRating;
    }
}

class ShopifyAppCategory extends BaseScrapedTable {
    constructor(
        public id: number | null = null,
        public createdOn: Date,
        public name: string | scrapeBlocks = '<not-scraped-yet>',
        public parentCategoryId: HttpUrl | number | null | scrapeBlocks = null,
        public shopifyPage: HttpUrl | scrapeBlocks = '<not-scraped-yet>',
        public categoryType: string | scrapeBlocks = '<not-scraped-yet>',
    ) {
        super(id, createdOn);
        this.name = name;
        this.parentCategoryId = parentCategoryId;
        this.shopifyPage = shopifyPage;
        this.categoryType = categoryType;
    }
}
class ShopifyAppDetail extends BaseScrapedTable {
    constructor(
        public id: number | null = null,
        public createdOn: Date,
        public shopifyPage: HttpUrl | scrapeBlocks = '<not-scraped-yet>',
        public appName: string | scrapeBlocks = '<not-scraped-yet>',
        public reviewCount: number | scrapeBlocks = '<not-scraped-yet>',
        public avgRating: number | scrapeBlocks = '<not-scraped-yet>',
        public partnerId: number | HttpUrl | scrapeBlocks = '<not-scraped-yet>',
    ) {
        super(id, createdOn);
        this.appName = appName;
        this.reviewCount = reviewCount;
        this.partnerId = partnerId;
    }
}
class ShopifyAppReviews extends BaseScrapedTable {
    _eqFields: string[] = ['reviewer', 'location', 'content'];

    constructor(
        public id: number | null = null,
        public createdOn: Date,
        public appId: number | HttpUrl | scrapeBlocks = '<not-scraped-yet>',
        public lastUpdatedPage: number | scrapeBlocks = '<not-scraped-yet>',
        public reviewer: string | scrapeBlocks = '<not-scraped-yet>',
        public location: string | scrapeBlocks = '<not-scraped-yet>',
        public content: string | scrapeBlocks = '<not-scraped-yet>',
        public daysSpentOnApp: number | scrapeBlocks = '<not-scraped-yet>',
        public rating: number | scrapeBlocks = '<not-scraped-yet>',
        public reviewDate: string | scrapeBlocks = '<not-scraped-yet>',
    ) {
        super(id, createdOn);
        this.appId = appId;
        this.lastUpdatedPage = lastUpdatedPage;
        this.reviewer = reviewer;
        this.location = location;
        this.content = content;
        this.daysSpentOnApp = daysSpentOnApp;
        this.rating = rating;
        this.reviewDate = reviewDate;
    }
}
class ShopifyPricingPlan extends BaseScrapedTable {
    _eqFields: string[] = ['planName', 'price', 'offer'];
    constructor(
        public id: number | null = null,
        public createdOn: Date,
        public planName: string | scrapeBlocks = '<not-scraped-yet>',
        public price: string | scrapeBlocks = '<not-scraped-yet>',
        public offer: string | scrapeBlocks = '<not-scraped-yet>',
        public appId: number | HttpUrl | scrapeBlocks = '<not-scraped-yet>',
    ) {
        super(id, createdOn);
        this.planName = planName;
        this.price = price;
        this.offer = offer;
        this.appId = appId;
    }
}
class ShopifyCategoryRankLog extends BaseScrapedTable {
    _eqFields: string[] = ['rank', 'appId', 'categoryId'];
    constructor(
        public id: number | null = null,
        public createdOn: Date,
        public categoryId:
            | number
            | HttpUrl
            | scrapeBlocks = '<not-scraped-yet>',
        public rank: number | scrapeBlocks = '<not-scraped-yet>',
        public appId: number | HttpUrl | scrapeBlocks = '<not-scraped-yet>',
    ) {
        super(id, createdOn);
        this.categoryId = categoryId;
        this.rank = rank;
        this.appId = appId;
    }
}
class ShopifyAppDescriptionLog extends BaseScrapedTable {
    _eqFields: string[] = ['description'];

    constructor(
        public id: number | null = null,
        public createdOn: Date,
        public appId: number | HttpUrl | scrapeBlocks = '<not-scraped-yet>',
        public description: string | scrapeBlocks = '<not-scraped-yet>',
    ) {
        super(id, createdOn);
        this.appId = appId;
        this.description = description;
    }
}

class ShopifyCommunityUserStats extends BaseScrapedTable {
    _eqFields: string[] = ['communityUserPage'];
    constructor(
        public id: number | null = null,
        public createdOn: Date,
        public communityUserPage: HttpUrl | scrapeBlocks = '<not-scraped-yet>',
        public communityUserName: string | scrapeBlocks = '<not-scraped-yet>',
        public communityUserType: string | scrapeBlocks = '<not-scraped-yet>',
        public postsCount: number | scrapeBlocks = '<not-scraped-yet>',
        public solutionsCount: number | scrapeBlocks = '<not-scraped-yet>',
        public likesCount: number | scrapeBlocks = '<not-scraped-yet>',
        public topicsStartedCount: number | scrapeBlocks = '<not-scraped-yet>',
        public partnerId: number | null | HttpUrl | scrapeBlocks = null,
    ) {
        super(id, createdOn);
        this.communityUserPage = communityUserPage;
        this.communityUserName = communityUserName;
        this.communityUserType = communityUserType;
        this.postsCount = postsCount;
        this.solutionsCount = solutionsCount;
        this.likesCount = likesCount;
        this.topicsStartedCount = topicsStartedCount;
        this.partnerId = partnerId;
    }
}

class ShopifyCommunityUserStatsLog extends BaseScrapedTable {
    _eqFields: string[] = [
        'communityUserId',
        'postsCount',
        'solutionsCount',
        'likesCount',
        'topicsStartedCount',
    ];
    constructor(
        public id: number | null = null,
        public createdOn: Date,
        public communityUserId: number | scrapeBlocks = '<not-scraped-yet>',
        public postsCount: number | scrapeBlocks = '<not-scraped-yet>',
        public solutionsCount: number | scrapeBlocks = '<not-scraped-yet>',
        public likesCount: number | scrapeBlocks = '<not-scraped-yet>',
        public topicsStartedCount: number | scrapeBlocks = '<not-scraped-yet>',
    ) {
        super(id, createdOn);
        this.communityUserId = communityUserId;
        this.postsCount = postsCount;
        this.solutionsCount = solutionsCount;
        this.likesCount = likesCount;
        this.topicsStartedCount = topicsStartedCount;
    }
}

export {
    ShopifyPartner,
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
