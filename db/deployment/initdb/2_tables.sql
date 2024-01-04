-- CREATE shopify_partner IN SCRAPED
CREATE TABLE
  shopify_partner (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    shopify_page TEXT NOT NULL,
    business_website TEXT,
    business_location TEXT,
    support_email TEXT,
    support_cellphone TEXT,
    years_built_apps NUMERIC(4, 2),
    apps_published INTEGER,
    avg_rating NUMERIC(3, 1),
    unknown_support_info TEXT[],
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  );
  -- CREATE SHOPIFY_APP_CATEGORY IN SCRAPED
CREATE TABLE
  shopify_app_category (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_category_id VARCHAR(255),
    shopify_page TEXT NOT NULL,
    category_type VARCHAR(50),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (parent_category_id) REFERENCES shopify_app_category (id)
  );

-- CREATE shopify_app_info IN SCRAPED
CREATE TABLE
  shopify_app_info (
    id VARCHAR(255) PRIMARY KEY,
    shopify_page TEXT NOT NULL,
    app_name VARCHAR(255),
    review_count INTEGER,
    avg_rating NUMERIC(3, 1),
    partner_id VARCHAR(255),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (partner_id) REFERENCES shopify_partner (id)
  );
  -- CREATE SHOPIFY_APP_REVIEWS IN SCRAPED
CREATE TABLE
  shopify_app_reviews (
    id INT PRIMARY KEY,
    app_id VARCHAR(255) NOT NULL,
    last_updated_page INT NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    store_location VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    approx_days_on_app FLOAT NOT NULL,
    rating INT NOT NULL,
    date_posted TIMESTAMP NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (app_id) REFERENCES shopify_app_info (id)
  );
  -- CREATE SHOPIFY_PRICING_PLAN IN SCRAPED
CREATE TABLE
  shopify_pricing_plan (
    id SERIAL PRIMARY KEY,
    plan_name VARCHAR(255) NOT NULL,
    price VARCHAR(255),
    additional_price_option VARCHAR(255),
    offer TEXT,
    app_id VARCHAR(255) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (app_id) REFERENCES shopify_app_info (id)
  );
  -- CREATE SHOPIFY_CATEGORY_RANK_LOG IN SCRAPED
CREATE TABLE
  shopify_category_rank_log (
    id SERIAL PRIMARY KEY,
    category_id VARCHAR(255) NOT NULL,
    "rank" INT NOT NULL,
    app_id VARCHAR(255) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (category_id) REFERENCES shopify_app_category (id),
    FOREIGN KEY (app_id) REFERENCES shopify_app_info (id)
  );
  -- CREATE SHOPIFY_APP_DESCRIPTION IN SCRAPED
CREATE TABLE
  shopify_app_description_log (
    id SERIAL PRIMARY KEY,
    app_id VARCHAR(255) NOT NULL,
    description TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (app_id) REFERENCES shopify_app_info (id)
  );
CREATE TABLE
  shopify_community_user_stats (
    id VARCHAR(255) PRIMARY KEY,
    community_user_page TEXT NOT NULL,
    community_user_name VARCHAR(50) NOT NULL,
    community_user_type VARCHAR(50) NOT NULL,
    posts_count INTEGER NOT NULL,
    solutions_count INTEGER NOT NULL,
    likes_count INTEGER NOT NULL,
    topics_started_count INTEGER NOT NULL,
    partner_id VARCHAR(255),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (partner_id) REFERENCES shopify_partner (id)
  );

CREATE TABLE
  shopify_community_user_stats_log (
    id SERIAL PRIMARY KEY,
    community_user_id VARCHAR(255) NOT NULL,
    posts_count INTEGER NOT NULL,
    solutions_count INTEGER NOT NULL,
    likes_count INTEGER NOT NULL,
    topics_started_count INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (community_user_id) REFERENCES shopify_community_user_stats (id)
);