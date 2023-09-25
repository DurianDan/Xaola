from .element_config import (
    SitemapElement,
    ShopifyAppElements,
    ShopifyProviderElements,
    ShopifyReviewsElements,
    ShopifyCommonElements,
    ShopifyCategoryElements,
)

from pydantic import HttpUrl


class ScrapeSitemapConfig(SitemapElement):
    sitemap_url: HttpUrl = "https://apps.shopify.com/sitemap"


class ScrapeAppConfig(ShopifyAppElements):
    pass


# TODO: implement other scrape config to other shopify pages
