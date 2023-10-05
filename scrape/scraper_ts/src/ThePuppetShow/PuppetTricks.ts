/** @todo Implements page scraping for individual Shopify URL.
 * 0. finish URL Config first
 * 1. Sitemap
 * 2. Nested Categories in Advertising Categories*/

import { ElementHandle } from "puppeteer";
import ScrapeResult from "../TheSalesman/ScrapeResult";
import { ShopifyPageURL } from "../TheSalesman/config/pages";
import PuppetMaster from "./PuppetMaster";

interface PuppetTrick{
    urls: ShopifyPageURL
    puppetMaster: PuppetMaster
    scrape(): ScrapeResult
};

class SitemapTrick implements PuppetTrick{
    public urls: ShopifyPageURL = new ShopifyPageURL({});

    constructor(
        public puppetMaster: PuppetMaster
    ){
        this.puppetMaster = puppetMaster
    }
    scrapePartnersElements():ElementHandle[]{
        return [];
    }
    scrape(): ScrapeResult {
        return {};
    }
}