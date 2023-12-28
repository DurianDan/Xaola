import { PuppeteerCrawler } from 'crawlee';

const crawler = new PuppeteerCrawler({
    async requestHandler({ request, page, log, enqueueLinks }) {
        const title = await page.$$(
            'div[class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-3"] > div'
            );
        log.info(`Amount of partnes in ${request.loadedUrl} is '${title.length}'`);
    }
});

await crawler.run(['https://apps.shopify.com/sitemap']);