import puppeteer from 'puppeteer';
import PuppetMaster from './ThePuppetShow/PuppetMaster';
import SitemapTrick from './ThePuppetShow/PuppetTricks/SitemapTrick';

async function scrape() {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--incognito', '--start-maximized'],
        });
        const page = await browser.newPage();
        const puppetMaster = new PuppetMaster(page, browser);

        const sitemapTrick = new SitemapTrick(puppetMaster, {});
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
