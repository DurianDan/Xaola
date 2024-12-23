import { URL } from 'url';
import {
    PartnerUrlConfig,
    ShopifyCommunityLanguageUrlSuffix,
} from '../AudienceProfile';
type HttpUrl = string;
import * as lodash from 'lodash';

class ShopifyPageURL {
    sitemap: HttpUrl = 'https://apps.shopify.com/sitemap';
    appsMarketPlace: HttpUrl = 'https://apps.shopify.com/';
    appPartnerPrefix: HttpUrl = 'https://apps.shopify.com/partners/';
    communityPrefix: HttpUrl = 'https://community.shopify.com';
    communityUserProfilePrefix: HttpUrl =
        'https://community.shopify.com/c/user/viewprofilepage/user-id/';
    appCategoryPrefix: HttpUrl = 'https://apps.shopify.com/categories/';
    reviewsPerPage: number = 10;
    communityLanguageSuffixes: ShopifyCommunityLanguageUrlSuffix = {
        english: '/c/shopify-community/ct-p/en?profile.language=en',
        french: '/c/communaut%C3%A9-shopify-fr/ct-p/fr?profile.language=fr',
        japanese: '/c/shopify-community-japan-jp/ct-p/jp?profile.language=ja',
        spanish: '/c/comunidad-de-shopify-es/ct-p/es?profile.language=es',
        german: '/c/shopify-community-de/ct-p/de?profile.language=de',
        italian: '/c/community-di-shopify-it/ct-p/it?profile.language=it',
        dutch: '/c/shopify-community-nl/ct-p/nl?profile.language=nl',
        portuguese:
            '/c/comunidade-da-shopify-pt-br/ct-p/pt-br?profile.language=pt-br',
        chineseSimplified:
            '/c/shopify-community-zh-cn/ct-p/zh-cn?profile.language=zh-CN',
    };

    constructor(public partnerIdentifiers: PartnerUrlConfig) {
        this.partnerIdentifiers = partnerIdentifiers;
    }
    normalizeUrl(prefix: string | URL, suffix: string): URL {
        const normalizedURL = new URL(suffix, prefix);
        return normalizedURL;
    }
    get appLandingPage(): URL {
        return this.normalizeUrl(
            this.appsMarketPlace,
            this.partnerIdentifiers.appUrlId ?? '',
        );
    }
    get appPartnerLandingPage(): URL {
        return this.normalizeUrl(
            this.appPartnerPrefix,
            this.partnerIdentifiers.partnerUrlId ?? '',
        );
    }
    get appReviewsDefaultPage(): string {
        return lodash.trim(this.appLandingPage.toString(), '/') + '/reviews';
    }
    get communityLandingPage(): URL {
        return this.normalizeUrl(
            this.communityPrefix,
            this.communityLanguageSuffixes[
                this.partnerIdentifiers.commutityLanguage ?? 'english'
            ],
        );
    }
    get communityUserProfile(): URL {
        if (this.partnerIdentifiers.communityUrlId) {
            return this.normalizeUrl(
                this.communityUserProfilePrefix,
                this.partnerIdentifiers.communityUrlId.toString(),
            );
        } else {
            return this.communityLandingPage;
        }
    }
    get appCategoryPage(): URL {
        return this.normalizeUrl(
            this.appCategoryPrefix,
            this.partnerIdentifiers.categoryUrlId ?? '',
        );
    }
    addPageParam(
        baseURL: URL,
        pageNum: number = 1,
        pageField: string = 'page',
    ): URL {
        const searchParams = new URLSearchParams();
        searchParams.set(pageField, pageNum.toString());
        baseURL.search = searchParams.toString();
        return baseURL;
    }
    reviewPaginatedURL(page: number, pageArg: string = 'page'): URL {
        return new URL(this.appReviewsDefaultPage + `?${pageArg}=${page}`);
    }
    appCategoryPaginatedURL(page: number): URL {
        return this.addPageParam(this.appCategoryPage, page);
    }
}

export { ShopifyPageURL };
