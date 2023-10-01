import {Page, Browser, Viewport} from "puppeteer";

export default class PuppetMaster{
    activePage: Page

    constructor(
        public browser: Browser,
        public defaultViewpoint: Viewport,
    ){
        this.browser = browser
        this.defaultViewpoint = defaultViewpoint
        this.activePage = await browser.newPage()
    }
}