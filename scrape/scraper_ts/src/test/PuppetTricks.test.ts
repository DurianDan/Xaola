import PuppetMaster from '../ThePuppetShow/PuppetMaster';
import initPuppet from '../initPuppet';
import SitemapTrick from '../ThePuppetShow/PuppetTricks/SitemapTrick';
import {
    // debugLaunchOptions,
    defaultLaunchOptions,
} from '../TheSalesman/config/browser';
import { ConsoleWatcher } from '../TheWatcher';

let puppetMaster: PuppetMaster;
let sitemapTrick: SitemapTrick;
const commonTimeLimit = 15000;
const scrapeSitemapTimeLimit = 1000 * 60 * 60;

beforeAll(async () => {
    const { page, browser } = await initPuppet(defaultLaunchOptions);
    const watcher = new ConsoleWatcher({})
    puppetMaster = new PuppetMaster(page, browser, {logNullElement: true});
    sitemapTrick = new SitemapTrick(puppetMaster, {}, watcher);
}, commonTimeLimit);

afterAll(async () => {
    await puppetMaster.close();
});

describe('Check SitemapTrick', () => {
    test(
        '1. accessPage()',
        async () => {
            expect(await sitemapTrick.accessPage()).toBe(true);
        },
        commonTimeLimit,
    );

    test(
        '2. scrape()',
        async () => {
            const result = await sitemapTrick.scrape();
            expect(result.shopifyPartner?.length ?? 0 > 5000).toBe(true);
            expect(result.shopifyAppDetail?.length ?? 0 > 8000).toBe(true);
            console.log(result.shopifyAppCategory);
            expect(result.shopifyAppCategory?.length ?? 50 > 8000).toBe(true);
        },
        scrapeSitemapTimeLimit,
    );
});
