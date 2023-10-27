import ScrapeResult from "./ScrapeResult";

export function mergeScrapeResult(resultsToMerge: ScrapeResult[]): ScrapeResult{
    const mergedResult: ScrapeResult = {
        shopifyPartner:[],
        shopifyAppCategory:[],
        shopifyAppDescriptionLog:[],
        shopifyAppDetail:[],
        shopifyAppReviews:[],
        shopifyCategoryRankLog:[],
        shopifyCommunityUserStats:[],
        shopifyCommunityUserStatsLog:[],
        shopifyPricingPlan:[],
    };
    resultsToMerge.forEach(result => {
        mergedResult.shopifyPartner?.push(...result.shopifyPartner??[])
        mergedResult.shopifyAppCategory?.push(...result.shopifyAppCategory??[])
        mergedResult.shopifyAppDescriptionLog?.push(...result.shopifyAppDescriptionLog??[])
        mergedResult.shopifyAppDetail?.push(...result.shopifyAppDetail??[])
        mergedResult.shopifyAppReviews?.push(...result.shopifyAppReviews??[])
        mergedResult.shopifyCategoryRankLog?.push(...result.shopifyCategoryRankLog??[])
        mergedResult.shopifyCommunityUserStats?.push(...result.shopifyCommunityUserStats??[])
        mergedResult.shopifyCommunityUserStatsLog?.push(...result.shopifyCommunityUserStatsLog??[])
        mergedResult.shopifyPricingPlan?.push(...result.shopifyPricingPlan??[])
    })
    return mergedResult
}