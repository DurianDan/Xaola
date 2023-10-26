import puppeteer from 'puppeteer';
import PuppetMaster from './ThePuppetShow/PuppetMaster';
import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';
import initPuppet from './initPupper';
import { defaultLaunchOptions } from './TheSalesman/config/browser';
import { ConsoleWatcher } from './TheWatcher';
import { WatchConfig } from './TheWatcher/BaseWatcher';

async function scrape() {
    try {
        const {page, browser} = await initPuppet(defaultLaunchOptions)
        const watcher = new ConsoleWatcher({level: "info"})
        const puppetMaster = new PuppetMaster(
            page, browser, {logNullElement: false}, watcher,);

        const sitemapTrick = new SitemapTrick(puppetMaster, {}, watcher);
        await sitemapTrick.accessPage();
        const partners = await sitemapTrick.scrapePartnersElements();
        console.log(partners.length);

        const partnerInfo =
            await sitemapTrick.extractBasicPartnerAppDetailFromPartnerElement(
                partners[0],
            );
        console.log(partnerInfo);
    } catch (error) {
        console.log(error);
    }
}

async function main() {
    await scrape();
}

main();
