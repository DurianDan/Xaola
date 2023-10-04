import { Page, Browser, Viewport, GoToOptions, ElementHandle } from 'puppeteer';

type Miliseconds = number;
type XpathExpression = string;

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

    /**
     * Delay whole programm for miliseconds,
     * @param number duration:Miliseconds
     */
    async delay(duration: Miliseconds) {
        return new Promise(function (resolve) {
            setTimeout(resolve, duration);
        });
    }

    async init(customViewport: Viewport): Promise<Page | void> {
        try {
            this.page = await this.browser.newPage();
            await this.page.setViewport(customViewport ?? this.defaultViewport);
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

    checkPage(): Page {
        if (this.page === null || this.page === undefined) {
            throw new Error(
                'Undefined `page`, needs to call this.init() first',
            );
        } else {
            return this.page;
        }
    }

    async getTextContent(element: ElementHandle<Node>): Promise<string> {
        try {
            const elementValue = (await (
                await element.getProperty('textContent')
            ).jsonValue()) as string;
            return elementValue;
        } catch (error) {
            throw error;
        }
    }

    async xpathElement(
        xpath: XpathExpression,
        getTextContent: boolean = true,
    ): Promise<ElementHandle<Node> | string> {
        const elements = await this.checkPage().$x(xpath);
        if (getTextContent) {
            return await this.getTextContent(elements[0]);
        }
        return elements[0];
    }

    async xpathElements(
        xpath: XpathExpression,
        getTextContent: boolean = true,
    ): Promise<(ElementHandle<Node> | string)[]> {
        const elements = await this.checkPage().$x(xpath);
        if (getTextContent) {
            await elements.forEach(async (ele) => {
                return await this.getTextContent(ele);
            });
        }
        return elements;
    }
}
