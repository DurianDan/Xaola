type HttpUrl = string 
type XpathExpression = string

class ShopifyCommonElements {
    topNavbarElement: XpathExpression = '//*[@id="AppStoreNavbar"]/nav'
}

class ShopifyReviewsElements{

    reviewContentElements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[1]/div[2]'    
    ratingElements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[1]/div[1]/div[1]'    
    reviewDateElements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[1]/div[1]/div[2]'    
    reviewerElements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[2]'
    showmoreButtonElement: XpathExpression = "//button"
    alteredReviewContentElements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[1]/div[2]'
    alteredRatingElements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[1]/div[1]/div[1]'    
    alteredReviewDateElements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[1]/div[1]/div[2]'
    alteredReviewerElements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[2]'
}
    
class ShopifyAppElements{
    providerHrefElement: XpathExpression = '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[2]/div[2]/div[3]/div/a'
    appNameElement: XpathExpression = '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[1]/div[2]/h1'
    pageCountElement: XpathExpression = '//*[@id="adp-reviews"]/div/div/h2'    
    pricingPlanElement: XpathExpression = '//*[@id="adp-pricing"]/div[2]/div[2]/div/div[*]'
    descriptionElement: XpathExpression = '//*[@id="app-details"]'
}

class ShopifyProviderElements{
    nameLineElement: XpathExpression = '//*[@id="PartnersShow"]/main/div/section/div[1]/h1'
    avgRatingElement: XpathExpression = '//*[@id="PartnersShow"]/main/div/section/div[1]/div/span[3]'
    appsPublishedCountElement: XpathExpression = '//*[@id="PartnersShow"]/main/div/section/div[1]/div/span[1]'
}

class ShopifySolutionElements{        
    title: XpathExpression = "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a"
    date: XpathExpression = '//*[@id="messageview2"]/div[2]/div/div[1]/div[2]/div/div/div/span/span[1]'
    likesCount: XpathExpression = "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[2]/div/div[1]/div[2]/div/div/span/a"
    typeOfCommunity: XpathExpression = '//*[@id="messageview2"]/div[2]/div/div[1]/div[1]/div/span'
    content: XpathExpression = '//*[@id="bodyDisplay"]/div/div[2]'
    solutionLink: XpathExpression = "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a"
    seemoreButtons: XpathExpression = '//*[text()="See more..."]' 
    alteredTitle: XpathExpression = "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[{idx}]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a"
    alteredDate: XpathExpression = '//*[@id="messageview2_{msg_idx}"]/div[2]/div/div[1]/div[2]/div/div/div/span/span[1]'
    alteredLikesCount: XpathExpression = "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[{idx}]/div[2]/div/div[1]/div[2]/div/div/span/a"
    alteredTypeOfCommunity: XpathExpression = '//*[@id="messageview2_{msg_idx}"]/div[2]/div/div[1]/div[1]/div/span'    
    alteredContent: XpathExpression = '//*[@id="bodyDisplay"]/div'
    alteredContent2(bodyDisplayIdx: number): XpathExpression {
        return `//*[@id="bodyDisplay_${bodyDisplayIdx}"]/div/div[2]`
    }
    alteredContent3(bodyDisplayIdx: number): XpathExpression{
        return `//*[@id="bodyDisplay_${bodyDisplayIdx}"]/div`
    } 
    alteredSolutionLink: XpathExpression = "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[{idx}]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a"
}

class SitemapElement{
    providerAreaElementPath: XpathExpression = '//*[@id="ToolsSitemap"]/main/div/div[3]/div[*]'
}
    
class ShopifyCategoryElements{
    /**
     * @todo find elements on category pages
     * */
}