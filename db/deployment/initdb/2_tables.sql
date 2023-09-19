-- Create shopify_provider in scraped
CREATE TABLE scraped.shopify_provider (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    shopify_page TEXT NOT NULL,
    apps_published INTEGER,
    avg_rating NUMERIC(3,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create shopify_app_category in scraped
CREATE TABLE scraped.shopify_app_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_category_id INT,
    shopify_page TEXT NOT NULL,
    category_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (parent_category_id) REFERENCES scraped.shopify_app_category(id)
);

-- Create shopfy_app_info in scraped
CREATE TABLE scraped.shopfy_app_info (
    id SERIAL PRIMARY KEY,
    shopify_page TEXT NOT NULL,
    name VARCHAR(255),
    review_count INTEGER,
    provider_id INT,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (provider_id) REFERENCES scraped.shopify_provider(id),
    FOREIGN KEY (category_id) REFERENCES scraped.shopify_app_category(id)
);

-- Create shopify_app_reviews in scraped
CREATE TABLE scraped.shopify_app_reviews (
    id SERIAL PRIMARY KEY,
    app_id INT NOT NULL,
    last_updated_page INT NOT NULL,
    reviewer VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    days_spend_on_app FLOAT NOT NULL,
    rating INT NOT NULL,
    review_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (app_id) REFERENCES scraped.shopfy_app_info(id)
);

-- Create shopify_pricing_plan in scraped
CREATE TABLE scraped.shopify_pricing_plan (
    id SERIAL PRIMARY KEY,
    plan_name VARCHAR(255) NOT NULL,
    price VARCHAR(255),
    offer TEXT,
    app_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (app_id) REFERENCES scraped.shopfy_app_info(id)
);

-- Create shopify_category_rank_log in scraped
CREATE TABLE scraped.shopify_category_rank_log (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL,
    "rank" INT NOT NULL,
    app_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (category_id) REFERENCES scraped.shopify_app_category(id),
    FOREIGN KEY (app_id) REFERENCES scraped.shopfy_app_info(id)
);

-- Create shopify_app_description in scraped
CREATE TABLE scraped.shopify_app_description (
    id SERIAL PRIMARY KEY,
    app_id INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (app_id) REFERENCES scraped.shopfy_app_info(id)
);
