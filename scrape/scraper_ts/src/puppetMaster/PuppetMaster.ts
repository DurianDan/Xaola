import { Page, Browser, Viewport, GoToOptions, LaunchOptions } from 'puppeteer';

type Miliseconds = number;

export default class PuppetMaster {
    public page: Page | null = null;
    
    constructor(
        public browser: Browser,
        public defaultGotoOptions: GoToOptions = { waitUntil: 'networkidle2' },
        public defaultViewport: Viewport = {
            width: 1280,
            height: 800,
            deviceScaleFactor: 1,
        },
    ) {
        this.browser = browser;
        this.defaultViewport = defaultViewport;
    }

    async delay(duration: Miliseconds) {
        return new Promise(function (resolve) {
            setTimeout(resolve, duration);
        });
    }

    async init(customViewport: Viewport): Promise<Page| void> {
        try {
            this.page = await this.browser.newPage();
            await this.page.setViewport(
                customViewport ?? this.defaultViewport,
            );
            return this.page;
        } catch (error) {
            console.log(error);
        }
    }

    async goto(url: URL, customGotoOptions: GoToOptions): Promise<void> {
        this.page?.goto(
            url.toString(),
            customGotoOptions ?? this.defaultGotoOptions,
        );
    }
}
