import puppeteer, {Page} from "puppeteer";
// import pl from "nodejs-polars";

type Miliseconds = number;
async function delay(duration: Miliseconds) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, duration)
    });
}

async function appsInfo(page: Page): Promise<any>{
    try {
        const appElement = await page.$x(`//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[2]/div[1]/div[1]/div[2]`)
        const appName = (await appElement[0].getProperty("textContent")).jsonValue()
        return appName;
    } catch (error) {
        console.log(error);        
        return null
    }
}

async function scrape() {
    try {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        const URL = "https://apps.shopify.com/tiktok/reviews";
        await page.setViewport({
            width: 1280, height: 800,
            deviceScaleFactor: 1
        });
        await page.goto(URL, {waitUntil: 'networkidle2'});
        await delay(1500);
        console.log(await appsInfo(page));
    } catch (error) {
        console.log(error);
        
    }
}

async function main() {
    await scrape();
}

main()