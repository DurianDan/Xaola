import { 
    DBShopifyPartner,
    DBShopifyAppCategory,
    DBShopifyAppDetail,
    DBShopifyAppReview,
    DBShopifyPricingPlan,
    DBShopifyCategoryRankLog,
    DBShopifyAppDescriptionLog,
    DBShopifyCommunityUserStats,
    DBShopifyCommunityUserStatsLog,
 } from '../supabase.public.types';
import BaseScrapedTable from './BaseScrapedTable';
import { urlToId } from './ScrapeResultUtilities';

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
        public unknownSupportInfo?: string[],
    ) {
        super(scrapedAt, urlToId(shopifyPage));
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
    toDBRecord(id?:number): DBShopifyPartner{
        const record = {
            apps_published: this.appsPublished,
            avg_rating: this.avgRating,
            business_location: this.businessLocation,
            business_website: this.businessWebsite,
            name: this.name,
            shopify_page: this.shopifyPage??"<not-scraped-yet>",
            support_cellphone: this.supportCellphone,
            support_email: this.supportEmail,
            unknown_support_info: this.unknownSupportInfo,
            years_built_apps: this.yearsBuiltApps,
            id:id
        }
        return this.removeNullUndefinedFields(record as DBShopifyPartner);
    }
}

class ShopifyAppCategory extends BaseScrapedTable {
    constructor(
        public scrapedAt: Date,
        public name?: string,
        public parentCategoryId?: HttpUrl | number,
        public shopifyPage?: HttpUrl,
        public categoryType?: string,
    ) {
        super(scrapedAt, urlToId(shopifyPage));
        this.name = name;
        this.parentCategoryId = parentCategoryId;
        this.shopifyPage = shopifyPage;
        this.categoryType = categoryType;
    }
    toDBRecord(id?:number): DBShopifyAppCategory{
        const record = {
            category_type: this.categoryType,
            name: this.name,
            parent_category_id: this.parentCategoryId ,
            shopify_page: this.shopifyPage,
            id:id
        }
        return this.removeNullUndefinedFields(
            record as DBShopifyAppCategory);
    }
}
class ShopifyAppDetail extends BaseScrapedTable {
    constructor(
        public scrapedAt: Date,
        public shopifyPage?: HttpUrl,
        public appName?: string,
        public reviewCount?: number,
        public avgRating?: number,
        public partnerId?: string,
    ) {
        super(scrapedAt, urlToId(shopifyPage));
        this.appName = appName;
        this.reviewCount = reviewCount;
        this.partnerId = partnerId;
    }
    toDBRecord(id?:number): DBShopifyAppDetail{
        const record = {
            app_name: this.appName, 
            avg_rating: this.avgRating, 
            partner_id: this.partnerId, 
            review_count: this.reviewCount, 
            shopify_page: this.shopifyPage, 
            id:id
        }
        return this.removeNullUndefinedFields(
            record as DBShopifyAppDetail);
    }
}
class ShopifyAppReview extends BaseScrapedTable {
    _eqFields: string[] = ['storeName', 'storeLocation', 'content'];

    constructor(
        public scrapedAt: Date,
        public appId?: string,
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
    toDBRecord(id?:number): DBShopifyAppReview{
        const record = {
            app_id: this.appId,
            approx_days_on_app: this.approxDaysOnApp,
            content: this.content,
            date_posted: this.datePosted?.toISOString(),
            last_updated_page: this.lastUpdatedPage,
            rating: this.rating,
            store_location: this.storeLocation,
            store_name: this.storeName,
            id: id,
        }
        return this.removeNullUndefinedFields(
            record as DBShopifyAppReview);
    }
}
class ShopifyPricingPlan extends BaseScrapedTable {
    _eqFields: string[] = ['planName', 'price', 'offer'];
    constructor(
        public scrapedAt: Date,
        public planName?: string,
        public price?: string,
        public offer?: string,
        public appId?: string,
        public additionalPriceOption?: string,
        public id?: number,
    ) {
        super(scrapedAt, id);
        this.planName = planName;
        this.price = price;
        this.offer = offer;
        this.appId = appId;
        this.additionalPriceOption = additionalPriceOption
    }
    toDBRecord(id?:number): DBShopifyPricingPlan{
        const record = {
            additional_price_option: this.additionalPriceOption,
            app_id: this.appId,
            offer: this.offer,
            plan_name: this.planName,
            price: this.price,
            id: id,
        }
        return this.removeNullUndefinedFields(
            record as DBShopifyPricingPlan);
    }
}
class ShopifyCategoryRankLog extends BaseScrapedTable {
    _eqFields: string[] = ['rank', 'appId', 'categoryId'];
    constructor(
        public scrapedAt: Date,
        public categoryId:string,
        public rank?: number,
        public appId?: string,
        public id?: number,
    ) {
        super(scrapedAt, id);
        this.categoryId = categoryId;
        this.rank = rank;
        this.appId = appId;
    }
    toDBRecord(id?:number): DBShopifyCategoryRankLog{
        const record = {
            rank: this.rank,
            category_id:this.categoryId,
            id:id
        }
        return this.removeNullUndefinedFields(
            record as DBShopifyCategoryRankLog);
    }
}
class ShopifyAppDescriptionLog extends BaseScrapedTable {
    _eqFields: string[] = ['description', 'appId'];

    constructor(
        public scrapedAt: Date,
        public appId?: string,
        public description?: string,
        public id?: number,
        ) {
            super(scrapedAt, id);
            this.appId = appId;
        this.description = description;
    }
    toDBRecord(id?:number): DBShopifyAppDescriptionLog{
        const record = {
            app_id:this.appId,
            description: this.description,
            id:id
        }
        return this.removeNullUndefinedFields(
            record as DBShopifyAppDescriptionLog);
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
        public partnerId?: string|null,
    ) {
        super(scrapedAt, urlToId(communityUserPage));
        this.communityUserPage = communityUserPage;
        this.communityUserName = communityUserName;
        this.communityUserType = communityUserType;
        this.postsCount = postsCount;
        this.solutionsCount = solutionsCount;
        this.likesCount = likesCount;
        this.topicsStartedCount = topicsStartedCount;
        this.partnerId = partnerId;
    }
    toDBRecord(id?:number): DBShopifyCommunityUserStats{
        const record = {
            community_user_name: this.communityUserName,
            community_user_page: this.communityUserPage,
            community_user_type: this.communityUserType,
            likes_count: this.likesCount,
            partner_id: this.partnerId,
            posts_count: this.postsCount,
            solutions_count: this.solutionsCount,
            topics_started_count: this.topicsStartedCount,
            id: id,
        }
        return this.removeNullUndefinedFields(
            record as DBShopifyCommunityUserStats);
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
        public communityUserId?: string,
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
    toDBRecord(id?:number): DBShopifyCommunityUserStatsLog{
        const record = {
            community_user_id: this.communityUserId,
            likes_count: this.likesCount,
            posts_count: this.postsCount,
            solutions_count: this.solutionsCount,
            topics_started_count: this.topicsStartedCount,
            id: id,
        }
        return this.removeNullUndefinedFields(
            record as DBShopifyCommunityUserStatsLog);
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
