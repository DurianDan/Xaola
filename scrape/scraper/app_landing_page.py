from typing import List, HttpUrl

from base_scraper import BaseScraper
from schemas.scraped_result import ScrapedResult
from schemas.scraped_tables import (
    ShopifyPricingPlan,
    ShopifyAppDescriptionLog,
    ShopifyAppDetail,
)
from scrape.scraper.scraper_utils.scraper_helper import DriverHelper


class AppLandingPageScraper(BaseScraper):
    def __init__(
        self,
        driver_helper: DriverHelper | None,
        landing_page: str,
        scraped_data: ScrapedResult | None = None,
    ) -> None:
        super().__init__(driver_helper, landing_page, scraped_data)

    def extract_app_detail(self) -> List[ShopifyAppDetail]:
        ...

    def extract_pricing_plans(self) -> List[ShopifyPricingPlan]:
        ...

    def extract_description(self) -> List[ShopifyAppDescriptionLog]:
        ...

    def extract_pricing_plans(self) -> List[ShopifyPricingPlan]:
        ...

    def scrape(self) -> ScrapedResult:
        self.initial_get()
        self.driver_helper.check_is_loaded()
        current_url = self.cleaned_url(
            self.driver_helper.check_element_loaded()
        )

        return super().scrape()
