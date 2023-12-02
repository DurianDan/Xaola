import BaseScrapedTable from './BaseScrapedTable';

type HttpUrl = string;
type Email = string;
type Cellphone = string;
// type scrapeBlocks = '<error>' | '<not-permitted>' | '<not-scraped-yet>';

class ShopifyPartner extends BaseScrapedTable {
    constructor(
        public scrapedAt: Date,
        public name?: string,
        public shopifyPage?: HttpUrl,
        public appsPublished?: number,
        public avgRating?: number,
        public businessWebsite?: HttpUrl,
        public businessLocation?: string,
        public supportEmail?: Email,
        public supportCellphone?: Cellphone,
        public yearsBuiltApps?: number,
        public unknownSupportInfo?: string,
        public id?: number,
    ) {
        super(scrapedAt, id);
        this.name = name;
        this.shopifyPage = shopifyPage;
        this.appsPublished = appsPublished;
        this.avgRating = avgRating;
        this.businessWebsite = businessWebsite
        this.businessLocation = businessLocation
        this.supportEmail = supportEmail
        this.supportCellphone = supportCellphone
        this.unknownSupportInfo = unknownSupportInfo
        this.yearsBuiltApps = yearsBuiltApps
    }
}

class ShopifyAppCategory extends BaseScrapedTable {
    constructor(
        public scrapedAt: Date,
        public name?: string,
        public parentCategoryId?: HttpUrl | number,
        public shopifyPage?: HttpUrl,
        public categoryType?: string,
        public id?: number,
    ) {
        super(scrapedAt, id);
        this.name = name;
        this.parentCategoryId = parentCategoryId;
        this.shopifyPage = shopifyPage;
        this.categoryType = categoryType;
    }
}
class ShopifyAppDetail extends BaseScrapedTable {
    constructor(
        public scrapedAt: Date,
        public shopifyPage?: HttpUrl,
        public appName?: string,
        public reviewCount?: number,
        public avgRating?: number,
        public partnerId?: number | HttpUrl,
        public id?: number,
    ) {
        super(scrapedAt, id);
        this.appName = appName;
        this.reviewCount = reviewCount;
        this.partnerId = partnerId;
    }
}
class ShopifyAppReview extends BaseScrapedTable {
    _eqFields: string[] = ['storeName', 'storeLocation', 'content'];

    constructor(
        public scrapedAt: Date,
        public appId?: number | HttpUrl,
        public lastUpdatedPage?: number,
        public storeName?: string,
        public storeLocation?: string,
        public content?: string,
        public approxDaysOnApp?: number,
        public rating?: number,
        public datePosted?: Date,
        public id?: number,
        ) {
            super(scrapedAt, id);
            this.appId = appId;
            this.lastUpdatedPage = lastUpdatedPage;
            this.storeName = storeName;
            this.storeLocation = storeLocation;
        this.content = content;
        this.approxDaysOnApp = approxDaysOnApp;
        this.rating = rating;
        this.datePosted = datePosted;
    }
}
class ShopifyPricingPlan extends BaseScrapedTable {
    _eqFields: string[] = ['planName', 'price', 'offer'];
    constructor(
        public scrapedAt: Date,
        public planName?: string,
        public price?: string,
        public offer?: string,
        public appId?: number | HttpUrl,
        public id?: number,
    ) {
        super(scrapedAt, id);
        this.planName = planName;
        this.price = price;
        this.offer = offer;
        this.appId = appId;
    }
}
class ShopifyCategoryRankLog extends BaseScrapedTable {
    _eqFields: string[] = ['rank', 'appId', 'categoryId'];
    constructor(
        public scrapedAt: Date,
        public categoryId:
            | number
            | HttpUrl
        ,
        public rank?: number,
        public appId?: number | HttpUrl,
        public id?: number,
    ) {
        super(scrapedAt, id);
        this.categoryId = categoryId;
        this.rank = rank;
        this.appId = appId;
    }
}
class ShopifyAppDescriptionLog extends BaseScrapedTable {
    _eqFields: string[] = ['description'];

    constructor(
        public scrapedAt: Date,
        public appId?: number | HttpUrl,
        public description?: string,
        public id?: number,
        ) {
            super(scrapedAt, id);
            this.appId = appId;
        this.description = description;
    }
}

class ShopifyCommunityUserStats extends BaseScrapedTable {
    _eqFields: string[] = ['communityUserPage'];
    constructor(
        public scrapedAt: Date,
        public communityUserPage?: HttpUrl,
        public communityUserName?: string,
        public communityUserType?: string,
        public postsCount?: number,
        public solutionsCount?: number,
        public likesCount?: number,
        public topicsStartedCount?: number,
        public partnerId?: number | null | HttpUrl,
        public id?: number,
    ) {
        super(scrapedAt, id);
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
        public scrapedAt: Date,
        public communityUserId?: number,
        public postsCount?: number,
        public solutionsCount?: number,
        public likesCount?: number,
        public topicsStartedCount?: number,
        public id?: number,
    ) {
        super(scrapedAt, id);
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
    ShopifyAppReview,
    ShopifyCategoryRankLog,
    ShopifyCommunityUserStats,
    ShopifyCommunityUserStatsLog,
    ShopifyPricingPlan,
    HttpUrl,
};
