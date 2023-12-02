-- Create shopify_partner in scraped
CREATE TABLE scraped.shopify_partner (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    shopify_page TEXT NOT NULL,
    business_website TEXT,
    business_location TEXT,
    support_email TEXT,
    support_cellphone TEXT,
    years_built_apps NUMERIC(4,2),
    apps_published INTEGER,
    avg_rating NUMERIC(3,1),
    unknown_support_info TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create shopify_app_category in scraped
CREATE TABLE scraped.shopify_app_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_category_id INT,
    shopify_page TEXT NOT NULL,
    category_type VARCHAR(50),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (parent_category_id) REFERENCES scraped.shopify_app_category(id)
);

-- Create shopify_app_info in scraped
CREATE TABLE scraped.shopify_app_info (
    id SERIAL PRIMARY KEY,
    shopify_page TEXT NOT NULL,
    app_name VARCHAR(255),
    review_count INTEGER,
    avg_rating FLOAT,
    partner_id INT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (partner_id) REFERENCES scraped.shopify_partner(id),
);

-- Create shopify_app_reviews in scraped
CREATE TABLE scraped.shopify_app_reviews (
    id SERIAL PRIMARY KEY,
    app_id INT NOT NULL,
    last_updated_page INT NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    store_location VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    approx_days_on_app FLOAT NOT NULL,
    rating INT NOT NULL,
    date_posted TIMESTAMP NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (app_id) REFERENCES scraped.shopify_app_info(id)
);

-- Create shopify_pricing_plan in scraped
CREATE TABLE scraped.shopify_pricing_plan (
    id SERIAL PRIMARY KEY,
    plan_name VARCHAR(255) NOT NULL,
    price VARCHAR(255),
    offer TEXT,
    app_id INT NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (app_id) REFERENCES scraped.shopify_app_info(id)
);

-- Create shopify_category_rank_log in scraped
CREATE TABLE scraped.shopify_category_rank_log (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL,
    "rank" INT NOT NULL,
    app_id INT NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (category_id) REFERENCES scraped.shopify_app_category(id),
    FOREIGN KEY (app_id) REFERENCES scraped.shopify_app_info(id)
);

-- Create shopify_app_description in scraped
CREATE TABLE scraped.shopify_app_description_log (
    id SERIAL PRIMARY KEY,
    app_id INT NOT NULL,
    description TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (app_id) REFERENCES scraped.shopify_app_info(id)
);


CREATE TABLE scraped.shopify_community_user_stats(
    id SERIAL PRIMARY KEY,
    community_user_page TEXT NOT NULL,
    community_user_name VARCHAR(50) NOT NULL,
    community_user_type VARCHAR(50) NOT NULL,
    posts_count INTEGER NOT NULL,
    solutions_count INTEGER NOT NULL,
    likes_count INTEGER NOT NULL,
    topics_started_count INTEGER NOT NULL,
    partner_id INT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (partner_id) REFERENCES scraped.shopify_partner(id),
);

CREATE TABLE scraped.shopify_community_user_stats_log(
    id SERIAL PRIMARY KEY,
    community_user_id INT NOT NULL,
    posts_count INTEGER NOT NULL,
    solutions_count INTEGER NOT NULL,
    likes_count INTEGER NOT NULL,
    topics_started_count INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (community_user_id) REFERENCES scraped.shopify_community_user_stats_log(id),
)