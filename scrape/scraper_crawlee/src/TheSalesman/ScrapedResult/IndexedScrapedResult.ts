import {
    ShopifyPartner,
    ShopifyAppCategory,
    ShopifyAppDetail,
    HttpUrl,
} from '../ScrapedTable';

interface IndexedScrapeResult {
    shopifyPartner: Map<HttpUrl, ShopifyPartner>;
    shopifyAppCategory: Map<HttpUrl, ShopifyAppCategory>;
    shopifyAppDetail: Map<HttpUrl, ShopifyAppDetail>;
}

export default IndexedScrapeResult;
