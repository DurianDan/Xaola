from pydantic import BaseModel

class BaseScrapedModel(BaseModel):
    scraped_at: datetime
    id: Optional[int]