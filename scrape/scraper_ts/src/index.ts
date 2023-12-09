import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase.public.types";
import ComplexMaster from "./ThePuppetShow/PuppetMaster/ComplexMaster";
import initPuppet from "./initPuppet";
import { defaultLaunchOptions } from "./TheSalesman/config/browser";
import { ConsoleWatcher } from "./TheWatcher";
import SitemapTrick from "./ThePuppetShow/PuppetTricks/SitemapTrick";
import ScrapeResult from "./TheSalesman/ScrapeResult";
import { HttpUrl, ShopifyAppCategory, ShopifyAppDetail, ShopifyPartner } from "./TheSalesman/ScrapedTable";
import AppLandingPageTrick from "./ThePuppetShow/PuppetTricks/AppLandingPageTrick";
import { isEmpty } from "lodash";
import { Browser, Page } from "puppeteer";
require('dotenv').config();

export const supabase = createClient<Database>(
    process.env.SUPABASE_PROJECT_URL as string,
    process.env.SUPABASE_SERVICE_KEY as string

)

async function getOldPartnerId(): Promise<Map<HttpUrl, number>>{
    const {data, error} = await supabase.from("shopify_partner").select("*")
    if (error){console.log(error);
    }
    let partnersIdx: Map<string, number> = Object();
    data?.forEach(record => {
        partnersIdx.set(record.shopify_page, record.id)
    })
    return partnersIdx;
}

async function getSitemapScrapedResult(page: Page, browser: Browser): Promise<ScrapeResult>{
    const partnerdIdx: Map<HttpUrl, number> = await getOldPartnerId();
    const watcher = new ConsoleWatcher({level:"info"})
    const complexMaster = new ComplexMaster(
    page,browser, { logNullElement: true }, watcher)
    const sitemapTrick = new SitemapTrick(complexMaster, {}, watcher);
    const result = await sitemapTrick.scrape();
    if (result.shopifyAppDetail){
        result.shopifyAppDetail = result.shopifyAppDetail.map(
            appDetail => {
                appDetail.partnerId = partnerdIdx.get(appDetail.partnerId as string)??appDetail.partnerId;
                return appDetail
            }
        )
    }
    return result
}
async function main(){
    const {page, browser} = await initPuppet(defaultLaunchOptions);
    try{
        const listAppDetails = (await getSitemapScrapedResult(page,browser)).shopifyAppCategory
        if (listAppDetails){
            const appCount = listAppDetails.length;
            for (const [idx, appDetail] of listAppDetails.entries()){
                console.log(`Scraping ${idx}/${appCount}`);
                const watcher = new ConsoleWatcher({level:"info"})
                const complexMaster = new ComplexMaster(
                page,browser, { logNullElement: true }, watcher)
                const appLPTrick = new AppLandingPageTrick(
                    appDetail.shopifyPage?.split("/")[0] as string,
                    complexMaster, {}, watcher
                )
                const scrapeResult = await appLPTrick.scrape();
                if (scrapeResult.shopifyAppDetail){
                    const scrapedApp = scrapeResult.shopifyAppDetail[0];
                    await supabase.from('shopify_app_info').insert(
                        {
                            'app_name': scrapedApp.appName??"",
                            'avg_rating': scrapedApp.avgRating,
                            'partner_id': scrapedApp.partnerId,
                            'shopify_page': scrapedApp.shopifyPage,
                        })
                }
            }
        }else{
            console.log("Empty listAppDetails");
            
        }
    }finally{
        await browser.close()
    }
}

main()