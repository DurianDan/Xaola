type XpathExpression = string;

const shopifyCommonElements = {
    topNavbarElement: '//*[@id="AppStoreNavbar"]/nav',
};

const fancyCategoryElements = {
    videoTagsElements: '//video',
    appCateogryInfo: {
        positions: '//div[@data-app-card-and-ad-wrap]',
        innerTagASelector: "a",
        innerAvgRatingSelector: 'div > div > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)',
        innerReviewCountSelector: 'div[data-app-card-and-ad-wrap] span:nth-child(4)',
        innerAppNameSelector: 'div > div > div > div:nth-child(1)'
        /* 
        $x('//div[@data-app-card-and-ad-wrap]/div/div/div/div[1]')[6].textContent.trim()
        'Linkpop'
        $x('//div[@data-app-card-and-ad-wrap]//span[4]')[6].textContent.trim()
        '56 total reviews'
        $x('//div[@data-app-card-and-ad-wrap]/div/div/div[1]/div[2]/span[1]')[6].textContent.trim()
        '3.4\n               out of 5 stars'
 */

    }
}

const shopifyReviewsElements = {
    reviewContentElements:
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[1]/div[2]',
    ratingElements:
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[1]/div[1]/div[1]',
    reviewDateElements:
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[1]/div[1]/div[2]',
    reviewerElements:
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[2]',
    showmoreButtonElement: '//button',
    alteredReviewContentElements:
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[1]/div[2]',
    alteredRatingElements:
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[1]/div[1]/div[1]',
    alteredReviewDateElements:
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[1]/div[1]/div[2]',
    alteredReviewerElements:
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[2]',
};

const shopifyAppElements = {
    avgRatingElement:
        '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[2]/div[2]/div[1]/span',
    reviewCountElement: '//*[@id="reviews-link"]',
    partnerHrefElement:
        '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[2]/div[2]/div[3]/div/a',
    appNameElement:
        '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[1]/div[2]/h1',
    pageCountElement: '//*[@id="adp-reviews"]/div/div/h2',
    pricingPlans: {
        planElement: '//*[@id="adp-pricing"]/div[2]/div[1]/div[*]/div[1]',
        priceNameElementTag: '//div[1]',
        nameElementTag: '//p[1]',
        priceElementTag: '//h3[1]',
        additionalPriceOptionElementTag: '//p[2]',
        planOfferElementTag: '//ul[1]',
    },
    descriptionElement: '//*[@id="app-details"]',
};

const shopifyPartnerElements = {
    nameLineElement: '//*[@id="PartnersShow"]/main/div/section/div[1]/h1',
    avgRatingElement:
        '//*[@id="PartnersShow"]/main/div/section/div[1]/div/span[3]',
    appsPublishedCountElement:
        '//*[@id="PartnersShow"]/main/div/section/div[1]/div/span[1]',
};

const shopifySolutionElements = {
    title: '/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a',
    date: '//*[@id="messageview2"]/div[2]/div/div[1]/div[2]/div/div/div/span/span[1]',
    likesCount:
        '/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[2]/div/div[1]/div[2]/div/div/span/a',
    typeOfCommunity:
        '//*[@id="messageview2"]/div[2]/div/div[1]/div[1]/div/span',
    content: '//*[@id="bodyDisplay"]/div/div[2]',
    solutionLink:
        '/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a',
    seemoreButtons: '//*[text()="See more..."]',
    alteredTitle:
        '/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[{idx}]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a',
    alteredDate:
        '//*[@id="messageview2_{msg_idx}"]/div[2]/div/div[1]/div[2]/div/div/div/span/span[1]',
    alteredLikesCount:
        '/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[{idx}]/div[2]/div/div[1]/div[2]/div/div/span/a',
    alteredTypeOfCommunity:
        '//*[@id="messageview2_{msg_idx}"]/div[2]/div/div[1]/div[1]/div/span',
    alteredContent: '//*[@id="bodyDisplay"]/div',
    alteredContent2: (bodyDisplayIdx: number) =>
        `//*[@id="bodyDisplay_${bodyDisplayIdx}"]/div/div[2]`,
    alteredContent3: (bodyDisplayIdx: number) =>
        `//*[@id="bodyDisplay_${bodyDisplayIdx}"]/div`,
    alteredSolutionLink:
        '/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[{idx}]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a',
};

const sitemapElements = {
    partnerAreaElementPath: '//*[@id="ToolsSitemap"]/main/div/div[3]/div[*]',
};

const shopifyCategoryElements = {
    /**
     * @todo find elements on category pages
     * */
};

type XpathPageConfig =
    | typeof shopifyCommonElements
    | typeof shopifyReviewsElements
    | typeof shopifyAppElements
    | typeof shopifyPartnerElements
    | typeof shopifySolutionElements
    | typeof sitemapElements
    | typeof shopifyCategoryElements;
    | typeof fancyCategoryElements

export {
    shopifyCommonElements,
    shopifyReviewsElements,
    shopifyAppElements,
    shopifyPartnerElements,
    shopifySolutionElements,
    sitemapElements,
    shopifyCategoryElements,
    fancyCategoryElements,
    XpathPageConfig,
};
