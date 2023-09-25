from typing import Literal
from abc import abstractmethod
from pydantic import BaseModel

from scraper_utils.scraper_helper import DriverHelper
from schemas.scraped_result import ScrapedResult


class BaseScraper:
    def __init__(
        self,
        driver_helper: DriverHelper | None,
        scrape_config: BaseModel,
        scraped_data: ScrapedResult | None = None,
    ) -> None:
        self.driver_helper = driver_helper
        self.scrape_config = scrape_config
        self.scraped_data = scraped_data if scraped_data else ScrapedResult()

    def cleaned_url(self, url: str) -> str:
        """Return cleaned url, without parameters"""
        return url.split("?")[0]

    def initial_get(self, custom_url: str | None = None) -> None:
        """Try to load the `self.landing_page`, or `custom_url` (if parsed)

        :param custom_url: if parsed, will try to load this url, instead of self.landing_page
        """
        self.driver_helper.force_get(
            custom_url if custom_url else self.landing_page
        )

    def log(
        self, msg: str, log_type: Literal["info", "warning", "error"] = "info"
    ) -> None:
        print(f"{self.__class__.__name__}:{log_type}:{msg}")

    @abstractmethod
    def scrape(
        self,
    ) -> ScrapedResult:
        ...
