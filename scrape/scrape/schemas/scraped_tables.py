from .base_scraped_table import BaseScrapedTable, DateType
from typing import List

class ShopifyProvider(BaseScrapedTable):
    name: str
    shopify_page: str
    apps_published: int
    avg_rating: float
    updated_at: DateType|None=None


class ShopifyAppCategory(BaseScrapedTable):
    name: str
    parent_category_id: int|None
    shopify_page: str
    category_type: str
    updated_at: DateType|None=None


class ShopifyAppInfo(BaseScrapedTable):
    shopify_page: str
    name: str
    review_count: int
    provider_id: int
    category_id: int
    updated_at: DateType|None=None


class ShopifyAppReviews(BaseScrapedTable):
    cfg_eq_fields: List[List[str]|str]|None = None

    app_id: int
    last_updated_page: int
    reviewer: str
    location: str
    content: str
    days_spend_on_app: float
    rating: int
    review_date: str


class ShopifyPricingPlan(BaseScrapedTable):
    cfg_eq_fields: List[List[str]|str]|None = None

    plan_name: str
    price: str
    offer: str
    app_id: int


class ShopifyCategoryRankLog(BaseScrapedTable):
    cfg_eq_fields: List[List[str]|str]|None = None

    category_id: int
    rank: int
    app_id: int


class ShopifyAppDescription(BaseScrapedTable):
    cfg_eq_fields: List[List[str]|str]|None = None

    app_id: int
    description: str
