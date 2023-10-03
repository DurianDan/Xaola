type HttpUrl = string 
type XpathExpression = string
/**
 * @todo implement element that needs to be formmated befor use
 */

class ShopifyCommonElements {
    top_navbar_element: XpathExpression = '//*[@id="AppStoreNavbar"]/nav'
}

class ShopifyReviewsElements{

    review_content_elements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[1]/div[2]'    
    rating_elements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[1]/div[1]/div[1]'    
    review_date_elements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[1]/div[1]/div[2]'    
    reviewer_elements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[2]'
    showmore_button_element: XpathExpression = "//button"
    altered_review_content_elements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[1]/div[2]'
    altered_rating_elements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[1]/div[1]/div[1]'    
    altered_review_date_elements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[1]/div[1]/div[2]'
    altered_reviewer_elements: XpathExpression = '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[2]'
}
    
class ShopifyAppElements{
    provider_href_element: XpathExpression = '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[2]/div[2]/div[3]/div/a'
    app_name_element: XpathExpression = '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[1]/div[2]/h1'
    page_count_element: XpathExpression = '//*[@id="adp-reviews"]/div/div/h2'    
    pricing_plan_element: XpathExpression = '//*[@id="adp-pricing"]/div[2]/div[2]/div/div[*]'
    description_element: XpathExpression = '//*[@id="app-details"]'
}

class ShopifyProviderElements{
    name_line_element: XpathExpression = '//*[@id="PartnersShow"]/main/div/section/div[1]/h1'
    avg_rating_element: XpathExpression = '//*[@id="PartnersShow"]/main/div/section/div[1]/div/span[3]'
    apps_published_count_element: XpathExpression = '//*[@id="PartnersShow"]/main/div/section/div[1]/div/span[1]'
}

class ShopifySolutionElements{        
    title: XpathExpression = "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a"
    date: XpathExpression = '//*[@id="messageview2"]/div[2]/div/div[1]/div[2]/div/div/div/span/span[1]'
    likes_count: XpathExpression = "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[2]/div/div[1]/div[2]/div/div/span/a"
    type_of_community: XpathExpression = '//*[@id="messageview2"]/div[2]/div/div[1]/div[1]/div/span'
    content: XpathExpression = '//*[@id="bodyDisplay"]/div/div[2]'
    solution_link: XpathExpression = "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a"
    seemore_buttons: XpathExpression = '//a[text()="See more..."]' 
    /**
     * @todo Check if this works
     * */
    altered_title: XpathExpression = "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[{idx}]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a"
    altered_date: XpathExpression = '//*[@id="messageview2_{msg_idx}"]/div[2]/div/div[1]/div[2]/div/div/div/span/span[1]'
    altered_likes_count: XpathExpression = "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[{idx}]/div[2]/div/div[1]/div[2]/div/div/span/a"
    altered_type_of_community: XpathExpression = '//*[@id="messageview2_{msg_idx}"]/div[2]/div/div[1]/div[1]/div/span'    
    altered_content: XpathExpression = '//*[@id="bodyDisplay"]/div'
    altered_content_2: XpathExpression = '//*[@id="bodyDisplay_{body_display_idx}"]/div/div[2]' // need format
    altered_content_3: XpathExpression = '//*[@id="bodyDisplay_{body_display_idx}"]/div' // need format
    altered_solution_link: XpathExpression = "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[{idx}]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a"
}

class SitemapElement{
    provider_area_element_path: XpathExpression = '//*[@id="ToolsSitemap"]/main/div/div[3]/div[*]'
}
    
class ShopifyCategoryElements{
    /**
     * @todo find elements on category pages
     * */

}
