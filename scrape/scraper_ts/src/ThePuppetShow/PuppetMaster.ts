import { Page, Browser, Viewport, GoToOptions, ElementHandle } from 'puppeteer';
import ScrapedElement from './ScrapedElement';
import { BaseWatcher } from '../TheWatcher/BaseWatcher';

type Miliseconds = number;
type PSelector = string;
type HttpUrl = string;

interface PuppetMasterConfig {
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
        this.watcher = watcher;
        this.config = this.initConfig(config);
    }
    /**
     * Check for undefined/missing fields in config, an replace theme with default values
     * @param {any} config:PuppetMasterConfig to be checked
     * @returns {any}
     */
    initConfig(config: PuppetMasterConfig): PuppetMasterConfig {
        config.defaultGotoOptions = config.defaultGotoOptions ?? {
            waitUntil: 'networkidle2',
        };
        config.defaultViewport = config.defaultViewport ?? {
            width: 1280,
            height: 800,
            deviceScaleFactor: 1,
        };
        return config;
    }
    logErrorNullElement(
        element: ScrapedElement,
        elementName?: string,
    ): ScrapedElement {
        if (this.config.logNullElement && elementName) {
            this.watcher?.checkError(element.element, {
                msg: `Cant find ${elementName} element, at xpath: ${element.selector}`,
            });
        }
        return element;
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
        this.page.setDefaultNavigationTimeout(0);
        this.watcher?.info({msg: "Loading "+url})
        await Promise.all([
            this.page.waitForNavigation(),
            this.page?.goto(
                url,
                customGotoOptions ?? this.config.defaultGotoOptions,
            ),
        ]);
    }
    checkPage(): Page {
        if (this.page === null || this.page === undefined) {
            throw new Error('Undefined `page`, created page first');
        } else {
            return this.page;
        }
    }
    /**
     * Select and get the elements based on provided `selector`, if pair-using with a parentElement, `selector` will be used as a `p-selector`. If not, `selector` will be treated as an `xpath`.
     * @param {any} selector:XPathExpression (or PSelector, if a parentElement is parsed)
     * @param {any} parentElement?:ScrapedElement
     * @param {any} elementName?:string for logging
     * @returns {any}
     */
    async selectElements(
        selector: PSelector | XPathExpression,
        parentElement?: ScrapedElement,
        elementName?: string,
    ): Promise<ScrapedElement[]> {
        const elements = parentElement
            ? await parentElement.element.$$(selector as string)
            : await this.checkPage().$x(selector as string);

        const scrapedElements = elements.map((ele) =>
            this.logErrorNullElement(
                new ScrapedElement(ele as ElementHandle, selector as string),
                elementName,
            ),
        );
        return scrapedElements;
    }
    async selectElement(
        selector: PSelector | XPathExpression,
        parentElement?: ScrapedElement,
        elementName: string = '',
    ): Promise<ScrapedElement> {
        const elements = await this.selectElements(
            selector,
            parentElement,
            elementName,
        );
        const resultElement = elements[0];

        if (resultElement) {
            return resultElement;
        } else {
            throw `null/undefined element: ${selector}`;
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
