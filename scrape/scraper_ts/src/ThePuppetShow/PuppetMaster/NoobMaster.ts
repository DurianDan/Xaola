// import { Page, Browser, Viewport, GoToOptions, ElementHandle } from 'puppeteer';
// import ComplexScrapedElement from '../ScrapedElement.ts/ComplexScrapedElement';
// import { BaseWatcher } from '../../TheWatcher/BaseWatcher';
// import { PuppetMaster, PuppetMasterConfig } from '.';
// import {CheerioAPI, Cheerio, load as CherioLoad} from 'cheerio';
// import { AnyNode } from 'cheerio';
// import ScrapedElement from '../ScrapedElement.ts';
// import NoobScrapedElement from '../ScrapedElement.ts/NoobScrapedElement';
// import axios from 'axios';

// type Miliseconds = number;

// class NoobMaster implements PuppetMaster<CheerioAPI, Cheerio<AnyNode>>{
//   constructor(
//     public config: PuppetMasterConfig,
//     public page?: CheerioAPI,
//     public watcher?: BaseWatcher,
//   ) {
//       this.watcher = watcher;
//       this.page = page;
//       this.config = this.initConfig(config);
//   }
//   initConfig(config: PuppetMasterConfig): PuppetMasterConfig {
//     return config
//   }

//   logErrorNullElement(
//       element: NoobScrapedElement,
//       elementName?: string,
//   ): NoobScrapedElement {
//       if (this.config.logNullElement && elementName) {
//           this.watcher?.checkError(element.element, {
//               msg: `Cant find ${elementName} element, at xpath: ${element.selector}`,
//           });
//       }
//       return element;
//   }

//   async goto(url: string): Promise<void> {
//     const {data} = await axios.get(url)
//     this.page = CherioLoad(data)
//   }
//   async delay(duration: Miliseconds) {
//     return new Promise(function (resolve) {
//         setTimeout(resolve, duration);
//     });
//   }
//   async selectElement(
//     selector: string | XPathExpression,
//     parentElement?: NoobScrapedElement,
//     elementName?: string | undefined
//   ): Promise<NoobScrapedElement | undefined> {
//     if (parentElement){
//       return parentElement.element
//     }
//   }

// }

// export default NoobMaster