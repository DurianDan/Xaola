type XpathExpression = string;

const shopifyCommonElements = {
    topNavbarElement: '//*[@id="AppStoreNavbar"]/nav',
};

const fancyCategoryElements = {
    videoTagsElements: '//video',
    appCateogryInfo: {
        positions: '//div[@data-app-card-handle-value]',
        innerTagASelector: 'a',
        innerAvgRatingSelector:
            'div > div > div:first-child > div:nth-child(2) > span:nth-child(1)',
        innerReviewCountSelector: 
            'div > div > div:first-child > div:nth-child(2) > span:nth-child(4)',
    },
};

const shopifyReviewsElements = {
    reviewCountElement: '//*[@id="arp-reviews"]/div/div[2]/div[1]/h1/span[3]',
    avgReviewElement: '//div[@class="app-reviews-metrics"]/div[2]/div[1]',
    appNameElement:
        '//*[@id="arp-reviews"]/div/div[2]/div[1]/h1/span[1]/a/span',
    reviewSectionElements: {
        fancy: '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]',
        normal: '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]',
        innerElementsSelectors: {
            storeName: 'div:nth-child(2) > div:first-child[title]',
            storeLocation: 'div:nth-child(2) > div:nth-child(2)',
            content:
                'div:first-child > div:nth-child(2)[data-truncate-review] > div:first-child[data-truncate-content-copy]',
            DaysOnAppLine: 'div:nth-child(2) > div:nth-child(3)',
            rating: 'div:first-child > div:first-child > div:first-child > div:first-child',
            datePosted: 'div:first-child > div:first-child > div:nth-child(2)',
        },
    },
};
// '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]'
// /html/body/main/section/div/div[3]/div[2]/div[2]/div[2]/div[1]/div[2]/div[1]

const shopifyAppElements = {
    avgRatingElement:
        '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[2]/div[2]/div[1]/span',
    reviewCountElement: '//*[@id="reviews-link"]',
    partnerHrefElement:
        '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[2]/div[2]/div[3]/div/a',
    partnerInfoBox: {
        appsPublishedElement:
            '//*[@id="adp-developer"]/div/div/div/div[1]/div[1]/a',
        averageRatingElement:
            '//*[@id="adp-developer"]/div/div/div/div[1]/p[1]',
        yearsBuiltAppsElement:
            '//*[@id="adp-developer"]/div/div/div/div[1]/p[2]',
        websiteTagAElement:
            '//*[@id="adp-developer"]/div/div/div/div[1]/div[2]/a',
        locationElement: '//*[@id="adp-developer"]/div/div/div/div[1]/p[3]',
        /* 
        the `supportInfoElements` are email and phone number.
        Might contains more type of info if more unique cases found.

        So the logic is to find all element with this xpath.
        if the the text contains "@" => email,
            if not => phone number
            if anything else, just save the data first, see later
        */
        supportInfoElements: '//*[@id="adp-developer"]/div/div/div/div[2]/p',
    },
    appNameElement:
        '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[1]/div[2]/h1',
    pageCountElement: '//*[@id="adp-reviews"]/div/div/h2',
    pricingPlans: {
        pricingPlanElements:'//div[@class="app-details-pricing-plan-card"]',
        nameElement: 'div[class="app-details-pricing-plan-card__head"] > p:first-child',
        nameElementAndOrAdditionalPriceOptionElement: 'div[class="app-details-pricing-plan-card__head"] >p',
        priceElement: 'div[class="app-details-pricing-plan-card__head"] > h3',
        planOfferElement: 'div[class="app-details-pricing-plan-card"] > ul',
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
    | typeof shopifyCategoryElements
    | typeof fancyCategoryElements;

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
