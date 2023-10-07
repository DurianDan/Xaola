interface ShopifyCommunityLanguageUrlSuffix {
    english: string;
    chineseSimplified: string;
    french: string;
    spanish: string;
    german: string;
    italian: string;
    dutch: string;
    portuguese: string;
    japanese: string;
}

interface AudienceProfile {
    partnerUrlId?: string;
    appUrlId?: string;
    communityUrlId?: number;
    commutityLanguage?: keyof ShopifyCommunityLanguageUrlSuffix;
    categoryUrlId?: string;
}

export { AudienceProfile, ShopifyCommunityLanguageUrlSuffix };
