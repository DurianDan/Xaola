import { createClient } from '@supabase/supabase-js';
import { DBIndexEntityTable, DBShopifyAppDetail, DBShopifyPartner, DBShopifyPricingPlan, Database } from './supabase.public.types';
import ComplexMaster from './ThePuppetShow/PuppetMaster/ComplexMaster';
import { checkMissingEnvVars, connectPuppet, initPuppet } from './initPuppet';
import { ConsoleWatcher } from './TheWatcher';
import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';
import RawScrapeResult from './TheSalesman/ScrapedResult/RawScrapeResult';
import { HttpUrl, ShopifyAppCategory, ShopifyAppDetail, ShopifyPartner, ShopifyPricingPlan } from './TheSalesman/ScrapedTable';
import AppLandingPageTrick from './ThePuppetShow/PuppetTricks/AppLandingPageTrick';
import { Browser, Page } from 'puppeteer';
import { defaultLaunchOptions } from './TheSalesman/config/browser';

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

async function upsertScrapedData<
    S extends ShopifyPartner|ShopifyAppCategory|ShopifyAppDetail,
    D extends DBIndexEntityTable
>(
    scrapedData: S[],
    tableToUpdate: IndexShopifyEntityTable,
    indexdOldRecords: Map<HttpUrl, DBIndex>
): Promise<D[]>{
    let recordsUpdated: D[] = [];
    let recordsToInsert: D[] = [];
    await Promise.all(scrapedData.map(
        async (record) => {
            const foundIdx = indexdOldRecords.get(record.shopifyPage??"")
            if (foundIdx){
                const {data, error} = await supabase
                    .from(tableToUpdate)
                    .update(record.toDBRecord(foundIdx))
                    .eq("id", foundIdx)
                    .select()
                if (error){console.log(error);}
                if (data && data.length > 0){
                    recordsUpdated.push(data[0] as D)
                }
            }else{
                recordsToInsert.push(record.toDBRecord() as D)
            }
        }
    )??[]);
    const {data, error} = await supabase.from(tableToUpdate).insert(recordsToInsert).select()
    if (error){console.log(error);
    }
    recordsUpdated.push(...(data as D[])??[])
    return recordsUpdated
}

async function updateSitemapScrapedResult(
    sitemapScrapedResult: RawScrapeResult
): Promise<{
    updatedAppsDetail: DBShopifyAppDetail[],
    updatedPartnerDetail: DBShopifyPartner[]
}>{
    const partnerUrlIdx = await getIndexedEntitiesId('shopify_partner');
    const appUrlIdx = await getIndexedEntitiesId('shopify_app_info');
    const categoriesIdx = await getIndexedEntitiesId('shopify_app_category');

    console.log("Updatting Partners Details");
    const updatedPartnerDetail = await upsertScrapedData<ShopifyPartner, DBShopifyPartner>(
        sitemapScrapedResult.shopifyPartner??[], 'shopify_partner', partnerUrlIdx)
    console.log(`Number of partners: ${updatedPartnerDetail.length}`);
    
    console.log("Updatting Category Details");
    const updatedAppCategories = await upsertScrapedData(
        sitemapScrapedResult.shopifyAppCategory??[], 'shopify_app_category', categoriesIdx)
    console.log(`Number of category: ${updatedAppCategories.length}`);

    console.log("Updatting App Details");
    const partnerUrlDBIndexMap = new Map<HttpUrl, DBIndex>();
    updatedPartnerDetail.forEach(partner => {
        if (partner.id){
            partnerUrlDBIndexMap.set(partner.shopify_page, partner.id)
        }
    })

    // update partnerId of each appDetail.
    sitemapScrapedResult.shopifyAppDetail??[].forEach((app: ShopifyAppDetail) => {
        if (app.partnerId){
            app.partnerId = partnerUrlDBIndexMap.get(app.partnerId as string)
        }
    })
    const updatedAppsDetail = await upsertScrapedData<ShopifyAppDetail, DBShopifyAppDetail>(
        sitemapScrapedResult.shopifyAppDetail??[], "shopify_app_info", appUrlIdx)
    console.log(`Number of apps: ${updatedAppsDetail.length}`);

    return {updatedAppsDetail, updatedPartnerDetail}
}

async function main() {
    const { page, browser } = await connectPuppet();
    console.log("page: "+ typeof page);
    console.log("browser: "+ typeof browser);
    
    const watcher = new ConsoleWatcher({ level: 'info' });
    const complexMaster = new ComplexMaster(
        page,
        browser,
        { logNullElement: true },
        watcher,
    );
    try {
        const sitemapScrapeResult = await getSitemapScrapedResult(page, browser);
        const {updatedAppsDetail, updatedPartnerDetail} = await updateSitemapScrapedResult(
            sitemapScrapeResult
        )
        const indexedPartnerUrl = new Map<HttpUrl, DBIndex>();
        updatedPartnerDetail.forEach(partner => {
            if (partner.id){
                indexedPartnerUrl.set(partner.shopify_page, partner.id)
            }
        })
        let plansToInsert: DBShopifyPricingPlan[] = [];

        watcher.info({msg:`Scraping apps detail`});
        for (const [idx, app] of updatedAppsDetail.entries()){
            watcher.info({msg:`Scraping ${idx}/${updatedAppsDetail.length}. ${app.shopify_page}`});
            const tmpAppUrlId = app.shopify_page.split("/")[-1]
            const tmpAppLPTrick = new AppLandingPageTrick(tmpAppUrlId, complexMaster, {}, watcher)
            const tmpAppLPScrapeResult = await tmpAppLPTrick.scrape()
            if (tmpAppLPScrapeResult.shopifyAppDetail){
                const {error} = await supabase
                    .from('shopify_app_info')
                    .update(tmpAppLPScrapeResult
                            .shopifyAppDetail[0]
                            .toDBRecord(app.id))
                    .eq('id', app.id as number)
                watcher.checkError(error, {msg: JSON.stringify(error)})
            }
            if (tmpAppLPScrapeResult.shopifyPartner){
                const foundPartner = tmpAppLPScrapeResult.shopifyPartner[0];
                if (foundPartner.shopifyPage){
                    foundPartner.id = indexedPartnerUrl.get(foundPartner.shopifyPage)
                    const {error} = await supabase
                        .from('shopify_partner')
                        .update(foundPartner.toDBRecord())
                        .eq('id', foundPartner.id as number)
                    watcher.checkError(error, {msg: JSON.stringify(error)})
                } 
            }
            tmpAppLPScrapeResult.shopifyPricingPlan??[].forEach(
                (plan:ShopifyPricingPlan) => {
                    plan.appId = app.id
                    plansToInsert.push(plan.toDBRecord())
                }
            )
            if (idx%10===0){
                const {error} = await supabase
                    .from('shopify_pricing_plan')
                    .insert(plansToInsert)
                watcher.checkError(error, {msg: JSON.stringify(error)})
                plansToInsert = []
            }
        }
        
    }catch(e){
        watcher.error({msg: "", err: e as Error})
    }finally {
        await browser.close();
    }
}

main();
