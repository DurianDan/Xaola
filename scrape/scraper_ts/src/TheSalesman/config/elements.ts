type XpathExpression = string;
type XpathPageConfig = {
    [key: string]:
        | XpathExpression
        | ((bodyDisplayIdx: number) => XpathExpression);
};

const shopifyCommonElements: XpathPageConfig = {
    topNavbarElement: '//*[@id="AppStoreNavbar"]/nav',
};

const shopifyReviewsElements: XpathPageConfig = {
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

const shopifyAppElements: XpathPageConfig = {
    partnerHrefElement:
        '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[2]/div[2]/div[3]/div/a',
    appNameElement:
        '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[1]/div[2]/h1',
    pageCountElement: '//*[@id="adp-reviews"]/div/div/h2',
    pricingPlanElement: '//*[@id="adp-pricing"]/div[2]/div[2]/div/div[*]',
    descriptionElement: '//*[@id="app-details"]',
};

const shopifyPartnerElements: XpathPageConfig = {
    nameLineElement: '//*[@id="PartnersShow"]/main/div/section/div[1]/h1',
    avgRatingElement:
        '//*[@id="PartnersShow"]/main/div/section/div[1]/div/span[3]',
    appsPublishedCountElement:
        '//*[@id="PartnersShow"]/main/div/section/div[1]/div/span[1]',
};

const shopifySolutionElements: XpathPageConfig = {
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

const sitemapElements: XpathPageConfig = {
    partnerAreaElementPath: '//*[@id="ToolsSitemap"]/main/div/div[3]/div[*]',
};

const shopifyCategoryElements: XpathPageConfig = {
    /**
     * @todo find elements on category pages
     * */
};

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
