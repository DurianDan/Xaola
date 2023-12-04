from typing import List, Union
from .base_scraped_model import BaseScrapedModel

class ShopifyPartner(BaseScrapedModel):
    name: str
    shopify_page: HttpUrl
    apps_published: Optional[int]
    avg_rating: Optional[float]
    business_website: Optional[HttpUrl]
    business_location: Optional[str]
    support_email: Optional[str]
    support_cellphone: Optional[str]
    years_built_apps: Optional[float]
    unknown_support_info: Optional[List[str]]

class ShopifyAppCategory(BaseScrapedModel):
    name: str
    parent_category_id: Optional[Union[HttpUrl, int]]
    shopify_page: HttpUrl
    category_type: Optional[str]

class ShopifyAppDetail(BaseScrapedModel):
    shopify_page: HttpUrl
    app_name: Optional[str]
    review_count: Optional[int]
    avg_rating: Optional[float]
    partner_id: Optional[Union[int, HttpUrl]]

class ShopifyAppReview(BaseScrapedModel):
    app_id: Union[int, HttpUrl]
    last_updated_page: int
    store_name: str
    store_location: str
    content: str
    approx_days_on_app: float
    rating: int
    date_posted: datetime

class ShopifyPricingPlan(BaseScrapedModel):
    plan_name: str
    price: Optional[str]
    offer: Optional[str]
    app_id: Union[int, HttpUrl]
    additional_price_option: Optional[str]

class ShopifyCategoryRankLog(BaseScrapedModel):
    category_id: Union[int, HttpUrl]
    rank: int
    app_id: Union[int, HttpUrl]

class ShopifyAppDescriptionLog(BaseScrapedModel):
    app_id: Union[int, HttpUrl]
    description: Optional[str]

class ShopifyCommunityUserStats(BaseScrapedModel):
    community_user_page: HttpUrl
    community_user_name: str
    community_user_type: str
    posts_count: int
    solutions_count: int
    likes_count: int
    topics_started_count: int
    partner_id: Optional[Union[int, HttpUrl]]

class ShopifyCommunityUserStatsLog(BaseScrapedModel):
    community_user_id: Optional[int]
    posts_count: int
    solutions_count: int
    likes_count: int
    topics_started_count: int
