import PuppetMaster from "../ThePuppetShow/PuppetMaster"
import initPuppet from "../initPupper"
import SitemapTrick from "../ThePuppetShow/PuppetTricks/SitemapTrick";
import {
    // debugLaunchOptions,
    defaultLaunchOptions
} from "../TheSalesman/config/browser";

let puppetMaster: PuppetMaster;
let sitemapTrick: SitemapTrick;
const commonTimeLimit = 15000;
const scrapeSitemapTimeLimit = 1000*60*60

beforeAll(async() => {
    const {page, browser} = await initPuppet(defaultLaunchOptions);
    puppetMaster = new PuppetMaster(page, browser);
    sitemapTrick = new SitemapTrick(puppetMaster, {});
}, commonTimeLimit)

afterAll(async () => {await puppetMaster.close()})

describe("Check SitemapTrick", ()=>{
    test("1. accessPage()", async() => {
        expect(await sitemapTrick.accessPage()).toBe(true);
    }, commonTimeLimit)

    test("2. scrape()",async () => {
        const result = await sitemapTrick.scrape();
        expect(result.shopifyPartner?.length??0 > 5000).toBe(true);
        expect(result.shopifyAppDetail?.length??0 > 8000).toBe(true);
        console.log(result.shopifyAppCategory);
        expect(result.shopifyAppCategory?.length??50 > 8000).toBe(true);
    }, scrapeSitemapTimeLimit)
})