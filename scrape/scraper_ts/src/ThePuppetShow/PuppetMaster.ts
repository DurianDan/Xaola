import { Page, Browser, Viewport, GoToOptions, ElementHandle } from 'puppeteer';
import ScrapedElement from './ScrapedElement';
import { BaseWatcher } from '../TheWatcher/BaseWatcher';

type Miliseconds = number;
type XpathExpression = string;
type HttpUrl = string;

interface PuppetMasterConfig{
    logNullElement: boolean;
    defaultGotoOptions?: GoToOptions;
    defaultViewport?: Viewport;
}

export default class PuppetMaster {
    constructor(
        public page: Page,
        public browser: Browser,
        public config: PuppetMasterConfig,
        public watcher?: BaseWatcher,
    ) {
        this.browser = browser;
        this.page = page;
        this.watcher = watcher
        this.config = this.initConfig(config)
    }
    /**
     * Check for undefined/missing fields in config, an replace theme with default values
     * @param {any} config:PuppetMasterConfig to be checked
     * @returns {any}
     */
    initConfig(config: PuppetMasterConfig): PuppetMasterConfig{
        config.defaultGotoOptions = config.defaultGotoOptions??{ waitUntil: 'networkidle2' }
        config.defaultViewport = config.defaultViewport??{
            width: 1280,
            height: 800,
            deviceScaleFactor: 1,
        }
        return config
    }
    logErrorNullElement(element: ScrapedElement, elementName: string):ScrapedElement{
        if (this.config.logNullElement){
            this.watcher?.checkError(
                element,
                {msg: `Cant find ${elementName} element, at xpath: ${element.xpath}`}
                )
        }
        return element
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
            this.page?.goto(url, customGotoOptions ?? this.config.defaultGotoOptions),
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
        elementName?: string
    ): Promise<ScrapedElement[]> {
        const elements = parentElement
            ? await parentElement.element.$$('xpath/' + xpath)
            : await this.checkPage().$x(xpath);

        const scrapedElements = elements.map(
            (ele) => this.logErrorNullElement(
                new ScrapedElement(ele as ElementHandle, xpath),
                elementName
                ),
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
