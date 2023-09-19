-- Install plpython3u if not already installed
CREATE EXTENSION IF NOT EXISTS plpython3u;

-- Connect to the xaola database
\c xaola;

CREATE SCHEMA IF NOT EXISTS scraped;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Grant necessary privileges to schemas (adjust as needed)
GRANT ALL PRIVILEGES ON SCHEMA analytics TO xaola;
GRANT ALL PRIVILEGES ON SCHEMA scraped TO xaola;
