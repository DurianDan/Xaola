import puppeteer, {
    PuppeteerLaunchOptions,
    Page,
    Browser,
    ConnectOptions,
} from 'puppeteer';

async function initPuppet(
    launchOptions: PuppeteerLaunchOptions,
): Promise<{ page: Page; browser: Browser }> {
    const browser: Browser = await puppeteer.launch(launchOptions);
    const page: Page = await browser.pages().then((e) => e[0]);
    return { browser, page };
}

async function connectPuppet(
    connectOptions?: ConnectOptions
): Promise<{ page: Page; browser: Browser }> {
    const serviceUser = process.env.BRIGHTDATA__SCRAPING_BROWSER__USER
    const servicePass = process.env.BRIGHTDATA__SCRAPING_BROWSER__PASSWORD
    const SBR_WS_ENDPOINT = `wss://${serviceUser}:${servicePass}@brd.superproxy.io:9222`;
    const browser = await puppeteer.connect(connectOptions??{
        browserWSEndpoint: SBR_WS_ENDPOINT,
        protocolTimeout: 1_800_000
    });
    const page: Page = await browser.newPage();
    return { browser, page };
}
function checkMissingEnvVars(){
    const envsNotSet: string[] = [];
    const envsNames: [string|undefined,string][] =[
        [process.env.BRIGHTDATA__SCRAPING_BROWSER__USER, "BRIGHTDATA__SCRAPING_BROWSER__USER"],
        [process.env.BRIGHTDATA__SCRAPING_BROWSER__PASSWORD, "BRIGHTDATA__SCRAPING_BROWSER__PASSWORD"]
    ]
    envsNames.forEach(([envObject, objName]) => {
        if (!envObject){
            envsNotSet.push(objName)
        }
    })
    if (envsNotSet.length > 0){
        throw new Error("Missing environment variables: "+envsNotSet)
    }
}

export { initPuppet, connectPuppet, checkMissingEnvVars };
