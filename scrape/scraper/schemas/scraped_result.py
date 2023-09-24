from pydantic import BaseModel
from typing import List
from .scraped_tables import (
    ShopifyPricingPlan,
    ShopifyAppCategory,
    ShopifyAppDescriptionLog,
    ShopifyAppDetail,
    ShopifyAppReviews,
    ShopifyCategoryRankLog,
    ShopifyProvider,
)


class ScrapedResult(BaseModel):
    shopify_pricing_plan: List[ShopifyPricingPlan] | None = None
    shopify_app_category: List[ShopifyAppCategory] | None = None
    shopify_app_description_log: List[ShopifyAppDescriptionLog] | None = None
    shopify_app_detail: List[ShopifyAppDetail] | None = None
    shopify_app_reviews: List[ShopifyAppReviews] | None = None
    shopify_category_rank_log: List[ShopifyCategoryRankLog] | None = None
    shopify_provider: List[ShopifyProvider] | None = None
