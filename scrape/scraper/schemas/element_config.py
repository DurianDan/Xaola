from pydantic import BaseModel, HttpUrl
from typing import Literal, Tuple

ElementIndicator = Tuple[
    Literal["class name", "xpath", "id", "css selector", "tag name"], str
]


class ShopifyCommonElements(BaseModel):
    top_navbar_element: ElementIndicator = [
        "xpath",
        '//*[@id="AppStoreNavbar"]/nav',
    ]


class ShopifyReviewsElements(ShopifyCommonElements):
    review_content_elements: ElementIndicator = [
        "xpath",
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[1]/div[2]',
    ]
    rating_elements: ElementIndicator = [
        "xpath",
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[1]/div[1]/div[1]',
    ]
    review_date_elements: ElementIndicator = [
        "xpath",
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[1]/div[1]/div[2]',
    ]
    reviewer_elements: ElementIndicator = [
        "xpath",
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[3]/div[*]/div[1]/div[2]',
    ]
    showmore_button_element: ElementIndicator = ["tag name", "button"]

    altered_review_content_elements: ElementIndicator = [
        "xpath",
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[1]/div[2]',
    ]
    altered_rating_elements: ElementIndicator = [
        "xpath",
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[1]/div[1]/div[1]',
    ]
    altered_review_date_elements: ElementIndicator = [
        "xpath",
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[1]/div[1]/div[2]',
    ]
    altered_reviewer_elements: ElementIndicator = [
        "xpath",
        '//*[@id="arp-reviews"]/div/div[3]/div[2]/div[2]/div[*]/div[1]/div[2]',
    ]


class ShopifyAppElements(ShopifyCommonElements):
    provider_href_element: ElementIndicator = (
        [
            "xpath",
            '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[2]/div[2]/div[3]/div/a',
        ],
    )
    app_name_element: ElementIndicator = [
        "xpath",
        '//*[@id="adp-hero"]/div/div/div[1]/div/div[1]/div[1]/div[2]/h1',
    ]
    page_count_element: ElementIndicator = [
        "xpath",
        '//*[@id="adp-reviews"]/div/div/h2',
    ]
    pricing_plan_element: ElementIndicator = (
        ["xpath", '//*[@id="adp-pricing"]/div[2]/div[2]/div/div[*]'],
    )
    description_element: ElementIndicator = (
        ["xpath", '//*[@id="app-details"]'],
    )


class ShopifyProviderElements(ShopifyCommonElements):
    name_line_element: ElementIndicator = [
        "xpath",
        '//*[@id="PartnersShow"]/main/div/section/div[1]/h1',
    ]
    avg_rating_element: ElementIndicator = [
        "xpath",
        '//*[@id="PartnersShow"]/main/div/section/div[1]/div/span[3]',
    ]
    apps_published_count_element: ElementIndicator = [
        "xpath",
        '//*[@id="PartnersShow"]/main/div/section/div[1]/div/span[1]',
    ]


class ShopifySolutionElements(ShopifyCommonElements):
    title: ElementIndicator = [
        "xpath",
        "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a",
    ]
    date: ElementIndicator = [
        "xpath",
        '//*[@id="messageview2"]/div[2]/div/div[1]/div[2]/div/div/div/span/span[1]',
    ]
    likes_count: ElementIndicator = [
        "xpath",
        "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[2]/div/div[1]/div[2]/div/div/span/a",
    ]
    type_of_community: ElementIndicator = [
        "xpath",
        '//*[@id="messageview2"]/div[2]/div/div[1]/div[1]/div/span',
    ]
    content: ElementIndicator = ["xpath", '//*[@id="bodyDisplay"]/div/div[2]']
    solution_link: ElementIndicator = [
        "xpath",
        "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[1]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a",
    ]

    seemore_buttons: ElementIndicator = ["link text", "See more..."]

    altered_title: ElementIndicator = [
        "xpath",
        "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[{idx}]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a",
    ]
    altered_date: ElementIndicator = [
        "xpath",
        '//*[@id="messageview2_{msg_idx}"]/div[2]/div/div[1]/div[2]/div/div/div/span/span[1]',
    ]
    altered_likes_count: ElementIndicator = [
        "xpath",
        "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[{idx}]/div[2]/div/div[1]/div[2]/div/div/span/a",
    ]
    altered_type_of_community: ElementIndicator = [
        "xpath",
        '//*[@id="messageview2_{msg_idx}"]/div[2]/div/div[1]/div[1]/div/span',
    ]
    altered_content: ElementIndicator = ["xpath", '//*[@id="bodyDisplay"]/div']
    altered_content_2: ElementIndicator = [
        "xpath",
        '//*[@id="bodyDisplay_{body_display_idx}"]/div/div[2]',
    ]
    altered_content_3: ElementIndicator = [
        "xpath",
        '//*[@id="bodyDisplay_{body_display_idx}"]/div',
    ]
    altered_solution_link: ElementIndicator = [
        "xpath",
        "/html/body/div[2]/center/div/div/div/div/div[1]/div[2]/div/div/div[3]/div/div[{idx}]/div[2]/div/div[1]/div[1]/div/div[2]/div/div/h2/span/a",
    ]


class SitemapElement(ShopifyCommonElements):
    provider_area_element_path: ElementIndicator = [
        "xpath",
        '//*[@id="ToolsSitemap"]/main/div/div[3]/div[*]',
    ]


class ShopifyCategoryElements(ShopifyCommonElements):
    # TODO: find element on category pages
    pass
