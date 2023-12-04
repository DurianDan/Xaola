import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase.public.types";
import ComplexMaster from "./ThePuppetShow/PuppetMaster/ComplexMaster";
import initPuppet from "./initPuppet";
import { defaultLaunchOptions } from "./TheSalesman/config/browser";
import { ConsoleWatcher } from "./TheWatcher";
import SitemapTrick from "./ThePuppetShow/PuppetTricks/SitemapTrick";
import ScrapeResult from "./TheSalesman/ScrapeResult";
import { ShopifyAppCategory, ShopifyPartner } from "./TheSalesman/ScrapedTable";
require('dotenv').config();

export const supabase = createClient<Database>(
    process.env.SUPABASE_PROJECT_URL as string,
    process.env.SUPABASE_SERVICE_KEY as string

)
async function getSitemapScrapedResult(): Promise<ScrapeResult>{
    const {page, browser} = await initPuppet(defaultLaunchOptions);
    try{
        const watcher = new ConsoleWatcher({level:"info"})
        const complexMaster = new ComplexMaster(
        page,browser, { logNullElement: true }, watcher)
        const sitemapTrick = new SitemapTrick(complexMaster, {}, watcher);
        return await sitemapTrick.scrape();
    }finally{
        await browser.close()
    }
}

async function main(){
    const {
        shopifyAppCategory,
        shopifyPartner
    } = await getSitemapScrapedResult()
    
    const formatedPartner: {
        shopify_page: string;
        name: string;
    }[] = Array.isArray(shopifyPartner)
        ? shopifyPartner.map((partner: ShopifyPartner): {
            'shopify_page': string;
            'name': string;
          } => ({
            'shopify_page': partner.shopifyPage ?? "",
            'name': partner.name ?? ""
          }))
        : [];
    
    const formatedAppCategories: {
        shopify_page: string;
        name: string;
    }[] = Array.isArray(shopifyAppCategory)
        ? shopifyAppCategory.map((partner: ShopifyPartner): {
            'shopify_page': string;
            'name': string;
          } => ({
            'shopify_page': partner.shopifyPage ?? "",
            'name': partner.name ?? ""
          }))
        : [];
    

    console.log('Uploading to shopifyPartner' + shopifyPartner?.length);
    const { data: data_shopify_partner, error: error_shopify_partner } = await supabase
        .from('shopify_partner')
        .insert(formatedPartner);
    if (data_shopify_partner) {
        console.log(data_shopify_partner);
    }
    if (error_shopify_partner){
        console.log(error_shopify_partner);
    }

    console.log('Uploading to shopifyPartner' + shopifyAppCategory?.length);
    let { data: data_category, error: error_category } = await supabase
        .from('shopify_app_category')
        .insert(formatedAppCategories);
    if (data_category) {
        console.log(data_category);
    }
    if (error_category){
        console.log(error_category);
        
    }
    // await Promise.all(shopifyPartner??[].map(
    //     async(partner:ShopifyPartner) => {
    //         await supabase.from('shopify_partner').insert(
    //             {
    //                 'shopify_page' : partner.shopifyPage??"",
    //                 'name':partner.name??""
    //             }
    //         )
    // }))
    // console.log('Uploading to shopifyAppCategory' + shopifyAppCategory?.length);
    // await Promise.all(shopifyAppCategory??[].map(
    //     async (cate:ShopifyAppCategory) => {
    //         await supabase.from('shopify_app_category').insert(
    //             {
    //                 "shopify_page": cate.shopifyPage??"",
    //                 "name": cate.name??""
    //             }
    //         )
    // }))
}

main()