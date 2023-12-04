from typing import Tuple, List
from .scraped_models import (
    ShopifyPartner,
    ShopifyAppCategory,
    ShopifyAppDetail,
    ShopifyAppReview,
    ShopifyPricingPlan,
    ShopifyCategoryRankLog,
    ShopifyAppDescriptionLog,
    ShopifyCommunityUserStats,
    ShopifyCommunityUserStatsLog,
    BaseScrapedModel
)

ScrapedModelEndpointName = str
scraped_table_endpoint_map: List[
    Tuple[BaseScrapedModel, ScrapedModelEndpointName]] = [
    [ShopifyPartner, "shopify_partner"],
    [ShopifyAppCategory, "shopify_app_category"],
    [ShopifyAppDetail, "shopify_app_detail"],
    [ShopifyAppReview, "shopify_app_review"],
    [ShopifyPricingPlan, "shopify_pricing_plan"],
    [ShopifyCategoryRankLog, "shopify_category_rank_log"],
    [ShopifyAppDescriptionLog, "shopify_app_description_log"],
    [ShopifyCommunityUserStats, "shopify_community_user_stats"],
    [ShopifyCommunityUserStatsLog, "shopify_community_user_stats_log"],
]