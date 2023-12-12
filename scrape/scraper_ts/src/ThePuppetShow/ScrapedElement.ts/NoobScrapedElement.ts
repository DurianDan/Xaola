// import { ClickOptions, ElementHandle, JSHandle, Page } from 'puppeteer';
// import ScrapedElement from '.';
// import { AnyNode, Cheerio, CheerioAPI } from 'cheerio';

// class NoobScrapedElement implements ScrapedElement<CheerioAPI, Cheerio<AnyNode>> {
//     constructor(
//         public element: Cheerio<AnyNode>,
//         public selector: string,
//         public page: CheerioAPI,
//     ) {
//         this.element = element;
//         this.selector = selector;
//         this.page = page;
//     }
//     async getProperty(propertyName: string): Promise<string> {
//         return ""
//     }
//     async getAttribute(attributeName: string): Promise<string> {
//         return ""
//     }
//     async text(): Promise<string> {
//         return await this.getProperty('textContent');
//     }
//     async href(): Promise<string> {
//         return await this.getProperty('href');
//     }
//     async hrefAndText(): Promise<{ href: string; text: string }> {
//         const href = await this.href();
//         const text = await this.text();
//         return { href, text };
//     }
//     async click(option?: ClickOptions): Promise<void> {
//         option
//         return    
//     }
// }

// export default NoobScrapedElement;
