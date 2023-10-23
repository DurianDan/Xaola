import { Page, Browser, Viewport, GoToOptions, ElementHandle } from 'puppeteer';
import ScrapedElement from './ScrapedElement';

type Miliseconds = number;
type XpathExpression = string;
type HttpUrl = string;

export default class PuppetMaster {
    constructor(
        public page: Page,
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
        this.page = page;
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
    async goto(url: HttpUrl, customGotoOptions?: GoToOptions): Promise<void> {
        await Promise.all([
            this.page.waitForNavigation(),
            this.page?.goto(url, customGotoOptions ?? this.defaultGotoOptions),
        ]);
    }
    checkPage(): Page {
        if (this.page === null || this.page === undefined) {
            throw new Error('Undefined `page`, created page first');
        } else {
            return this.page;
        }
    }
    async xpathElements(
        xpath: XpathExpression,
        parentElement?: ScrapedElement,
    ): Promise<ScrapedElement[]> {
        const elements = parentElement
            ? await parentElement.element.$$('xpath/' + xpath)
            : await this.checkPage().$x(xpath);

        const scrapedElements = elements.map(
            (ele) => new ScrapedElement(ele as ElementHandle),
        );
        return scrapedElements;
    }
    async xpathElement(
        xpath: XpathExpression,
        parentElement?: ScrapedElement,
    ): Promise<ScrapedElement> {
        const elements = await this.xpathElements(xpath, parentElement);
        const resultElement = elements[0];

        if (resultElement) {
            return resultElement;
        } else {
            throw `null/undefined element: ${xpath}`;
        }
    }
    async allTagAHrefsTexts(): Promise<{ href: HttpUrl; text: string }[]> {
        const hrefsTexts = await this.page.$$eval('a', (as) =>
            as.map((a) => ({
                href: a.href,
                text: a.textContent as string,
            })),
        );
        return hrefsTexts;
    }
    async close(): Promise<void> {
        await this.browser.close();
    }
}
