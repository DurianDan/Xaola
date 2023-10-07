import { Page, Browser, Viewport, GoToOptions, ElementHandle } from 'puppeteer';

type Miliseconds = number;
type XpathExpression = string;
type HttpUrl = string;

class ScrapedElement {
    constructor(public element: ElementHandle) {
        this.element = element;
    }
    async text(): Promise<string> {
        try {
            const elementValue = (await (
                await this.element.getProperty('textContent')
            ).jsonValue()) as string;
            return elementValue;
        } catch (error) {
            throw error;
        }
    }
    async getAttribute(attributeName: string): Promise<string>{
        const attributeValue = await this.element.evaluate(
            (a) => a.getAttribute(attributeName), this.element
            );
        if (attributeValue){
            return attributeValue
        }else{
            throw new Error(`Cant get attribute '${attributeName}', it might not exist!!!`)
        }
    }
    async href():Promise<string>{
        return (await this.getAttribute('href'))
    }
    async hrefAndText():Promise<{href: string, text: string}>{
        const href = await this.href();
        const text = await this.text();
        return {href, text}
    }
}

class PuppetMaster {
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

    async init(customViewport?: Viewport): Promise<Page | void> {
        try {
            this.page = await this.browser.newPage();
            await this.page.setViewport(customViewport ?? this.defaultViewport);
            return this.page;
        } catch (error) {
            console.log(error);
        }
    }

    async goto(url: HttpUrl, customGotoOptions?: GoToOptions): Promise<void> {
        this.page?.goto(url, customGotoOptions ?? this.defaultGotoOptions);
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

    async xpathElement(
        xpath: XpathExpression,
        parentElement?: ScrapedElement,
    ): Promise<ScrapedElement> {
        const element = parentElement
            ? await parentElement.element.$(xpath)
            : await this.checkPage().$(xpath);

        if (element) {
            return new ScrapedElement(element);
        } else {
            throw `null/undefined element: ${xpath}`;
        }
    }

    async xpathElements(
        xpath: XpathExpression,
        parentElement?: ScrapedElement,
    ): Promise<ScrapedElement[]> {
        const elements = parentElement
            ? await parentElement.element.$$(xpath)
            : await this.checkPage().$$(xpath);

        const scrapedElements = elements.map(
            (ele) => new ScrapedElement(ele as ElementHandle),
        );
        return scrapedElements;
    }
}

export { PuppetMaster, ScrapedElement };
