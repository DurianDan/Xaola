import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase.public.types';
import ComplexMaster from './ThePuppetShow/PuppetMaster/ComplexMaster';
import { checkMissingEnvVars, connectPuppet } from './initPuppet';
import { ConsoleWatcher } from './TheWatcher';
import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';
import RawScrapeResult from './TheSalesman/ScrapedResult/RawScrapeResult';
import { HttpUrl } from './TheSalesman/ScrapedTable';
import AppLandingPageTrick from './ThePuppetShow/PuppetTricks/AppLandingPageTrick';
import { Browser, Page } from 'puppeteer';
import { getIndexedScrapedResult } from './TheSalesman/ScrapeResultUtilities';

require('dotenv').config();
checkMissingEnvVars();

export const supabase = createClient<Database>(
    process.env.SUPABASE_PROJECT_URL as string,
    process.env.SUPABASE_SERVICE_KEY as string,
);

type IndexShopifyEntityTable =
    | 'shopify_partner'
    | 'shopify_app_category'
    | 'shopify_app_info';
type DBIndex = number;

async function getIndexedEntitiesId(
    tableName: IndexShopifyEntityTable,
): Promise<Map<HttpUrl, DBIndex>> {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
        console.log(error);
    }
    let partnersIdx: Map<string, number> = Object();
    data?.forEach((record) => {
        partnersIdx.set(record.shopify_page, record.id);
    });
    return partnersIdx;
}

async function getSitemapScrapedResult(
    page: Page,
    browser: Browser,
): Promise<RawScrapeResult> {
    const watcher = new ConsoleWatcher({ level: 'info' });
    const complexMaster = new ComplexMaster(
        page,
        browser,
        { logNullElement: true },
        watcher,
    );
    const sitemapTrick = new SitemapTrick(complexMaster, {}, watcher);
    return await sitemapTrick.scrape();
}

async function updateSitemapScrapedResult(
    sitemapScrapedResult: RawScrapeResult
){
    const partnerUrlIdx = getIndexedEntitiesId('shopify_partner');
    const appUrlIdx = getIndexedEntitiesId('shopify_app_info');
    const categoriesIdx = getIndexedEntitiesId('shopify_app_category');

    supabase.from('shopify_partner').update

}

async function getNewShopifyEntitiesFromScrapedResult() {}
if (result.shopifyAppDetail) {
    result.shopifyAppDetail = result.shopifyAppDetail.map((appDetail) => {
        appDetail.partnerId =
            partnerIdx.get(appDetail.partnerId as string) ??
            appDetail.partnerId;
        return appDetail;
    });
}
return result;

async function main() {
    const { page, browser } = await connectPuppet();
    const watcher = new ConsoleWatcher({ level: 'info' });
    const complexMaster = new ComplexMaster(
        page,
        browser,
        { logNullElement: true },
        watcher,
    );
    try {
        const oldPartnerData = await getOldPartnerId();
        const listAppDetails = (
            await getSitemapScrapedResult(page, browser, oldPartnerData)
        ).shopifyAppCategory;
        if (listAppDetails) {
            for (const [idx, appDetail] of listAppDetails.entries()) {
                console.log(`Scraping ${idx}/${listAppDetails.length}`);
                const appLPTrick = new AppLandingPageTrick(
                    appDetail.shopifyPage?.split('/')[0] as string,
                    complexMaster,
                    {},
                    watcher,
                );
                // scrape the landing page
                const scrapeResult = await appLPTrick.scrape();
                if (scrapeResult.shopifyAppDetail) {
                    const scrapedApp = scrapeResult.shopifyAppDetail[0];
                    await supabase.from('shopify_app_info').insert({
                        app_name: scrapedApp.appName ?? '',
                        avg_rating: scrapedApp.avgRating,
                        partner_id: scrapedApp.partnerId,
                        shopify_page: scrapedApp.shopifyPage,
                    });
                }
            }
        } else {
            console.log('Empty listAppDetails');
        }
    } finally {
        await browser.close();
    }
}

main();
