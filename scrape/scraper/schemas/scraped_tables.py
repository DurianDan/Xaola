from .base_scraped_table import BaseScrapedTable, DateType
from pydantic import HttpUrl
from typing import List


class ShopifyProvider(BaseScrapedTable):
    name: str
    shopify_page: HttpUrl
    apps_published: int
    avg_rating: float
    updated_at: DateType | None = None


class ShopifyAppCategory(BaseScrapedTable):
    name: str
    parent_category_id: HttpUrl | int | None
    shopify_page: HttpUrl
    category_type: str
    updated_at: DateType | None = None


class ShopifyAppDetail(BaseScrapedTable):
    shopify_page: HttpUrl
    name: str
    review_count: int
    provider_id: int | HttpUrl
    category_id: int | HttpUrl | None
    updated_at: DateType | None = None


class ShopifyAppReviews(BaseScrapedTable):
    _eq_fields: List[List[str] | str] | None = [
        ["reviewer", "location", "content"]
    ]

    app_id: int | HttpUrl
    last_updated_page: int
    reviewer: str
    location: str
    content: str
    days_spend_on_app: float
    rating: int
    review_date: str


class ShopifyPricingPlan(BaseScrapedTable):
    _eq_fields: List[List[str] | str] | None = [["plan_name", "price", "offer"]]

    plan_name: str
    price: str
    offer: str
    app_id: int | HttpUrl


class ShopifyCategoryRankLog(BaseScrapedTable):
    _eq_fields: List[List[str] | str] | None = [
        ["rank", "app_id", "category_id"]
    ]

    category_id: int | HttpUrl
    rank: int
    app_id: int | HttpUrl


class ShopifyAppDescriptionLog(BaseScrapedTable):
    _eq_fields: List[List[str] | str] | None = ["description"]

    app_id: int | HttpUrl
    description: str
