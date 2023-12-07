import { Page, Browser, Viewport, GoToOptions, ElementHandle } from 'puppeteer';
import ComplexScrapedElement from '../ScrapedElement.ts/ComplexScrapedElement';
import { BaseWatcher } from '../../TheWatcher/BaseWatcher';
import PuppetMaster from '.';
import {CheerioAPI, Cheerio, load as CherioLoad} from 'cheerio';
import { AnyNode } from 'cheerio';
const markup = `
<ul class="fruits">
  <li class="fruits__mango"> Mango </li>
  <li class="fruits__apple"> Apple </li>
</ul>
`;

const $ = CherioLoad(markup);
console.log($(".a"));


class NoobMaster implements PuppetMaster<CheerioAPI, Cheerio<AnyNode>>{
    constructor(
        public page: CheerioAPI,
        
    )
}