import ScrapeResult from "./ScrapeResult";
import pl from 'nodejs-polars';

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

// interface ScrapedResultFilePath{
//     shopifyPartner: string,
//     shopifyAppCategory: string,
//     shopifyAppDescriptionLog: string,
//     shopifyAppDetail: string,
//     shopifyAppReviews: string,
//     shopifyCategoryRankLog: string,
//     shopifyCommunityUserStats: string,
//     shopifyCommunityUserStatsLog: string,
//     shopifyPricingPlan: string,
// }

// type SaveFileType = "arrow"|"csv"|"parquet";

// interface SaveScrapedResultConfig {
//     filepaths: string|ScrapedResultFilePath,
//     suffix?: string,
//     prefix?: string,
//     filetype: SaveFileType
// }

// export function saveCustomFile(result)
// export function saveScrapedResult(result: ScrapeResult, saveConfig: SaveScrapedResultConfig):void{

// }