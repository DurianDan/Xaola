import { CheerioAPI } from "cheerio";
import NoobMaster from "../PuppetMaster/NoobMaster";
import {
  shopifyStaticCategoryElements,
  shopifyFancyStaticCategoryElements,
  fancyCategoryElements,
  CategoryXpathPageConfig
} from "../../TheSalesman/config/elements";

/** @todo: implement indicatting category types*/

const xpathConfigs:CategoryXpathPageConfig[]= [
    shopifyStaticCategoryElements,
    shopifyFancyStaticCategoryElements,
    fancyCategoryElements,
]

function identifyCategoryXpathConfig(
loadedHtml: CheerioAPI
): CategoryXpathPageConfig|null{
    for (const config of xpathConfigs){
        if (loadedHtml(config.identifierElement)){
            return config
        }
    }
    return null
}

export default identifyCategoryXpathConfig