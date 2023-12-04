from .main import app_scraper
from .thesalesman.scraped_models_endpoints_map import scraped_table_endpoint_map
@app_scraper.get("/diduduadi")
async def lets_didudua():
    return {"deodudua":"dau"}

for scraped_data_model, endpoint in scraped_models_endpoints_map:    
    @app_scraper.post(f"/scrape/{endpoint}")
    async def insert_scraped_data(scraped_data: scraped_data_model):
        return {"ok":"inserted"}