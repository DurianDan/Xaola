type XpathExpression = string;

const shopifyCommonElements = {
    topNavbarElement: '//*[@id="AppStoreNavbar"]/nav',
};

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
    avgRatingElement: '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[2]/div[2]/div[1]/span',
    reviewCountElement: '//*[@id="reviews-link"]',
    partnerHrefElement:
        '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[2]/div[2]/div[3]/div/a',
    appNameElement:
        '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[1]/div[2]/h1',
    pageCountElement: '//*[@id="adp-reviews"]/div/div/h2',
    pricingPlans: {
        planName: '//*[@id="adp-pricing"]/div[2]/div[1]/div[*]/div[1]/div[1]/p[1]',
        priceLine: '//*[@id="adp-pricing"]/div[2]/div[1]/div[*]/div[1]/div[1]/h3[1]',
        
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

type XpathPageConfig = typeof  shopifyCommonElements
    | typeof shopifyReviewsElements
    | typeof shopifyAppElements
    | typeof shopifyPartnerElements
    | typeof shopifySolutionElements
    | typeof sitemapElements
    | typeof shopifyCategoryElements

export {
    shopifyCommonElements,
    shopifyReviewsElements,
    shopifyAppElements,
    shopifyPartnerElements,
    shopifySolutionElements,
    sitemapElements,
    shopifyCategoryElements,
    XpathPageConfig,
};
