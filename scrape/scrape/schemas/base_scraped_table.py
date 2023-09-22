from pydantic import BaseModel
from datetime import datetime, date
from typing import List 

DateType = date|datetime

class BaseScrapedTable(BaseModel):
    id: int|None = None 
    created_on: DateType|None = datetime.now().astimezone()
    cfg_eq_fields: List[List[str]|str]|None = ["shopify_page"]
    
    def __eq__(self, __value: 'BaseScrapedTable') -> bool:
        assert self.cfg_eq_fields, f"`cfg_eq_fields` is missing, cant compare to other `{self.__class__.__name__}`"
        for field_group in self.cfg_eq_fields:
            if (type(field_group) is str
                and getattr(self, field_group) == getattr(__value, field_group)
            ):
                return True
            if all([
                getattr(self,field) == getattr(__value,field)
                for field in field_group
            ]):
                return True
        return False
    
if __name__=="__main__":
    ok = BaseScrapedTable(
        id=1,
        cfg_eq_fields=["id"])
    ok2 = BaseScrapedTable(
        id=4,
        cfg_eq_fields=["id"])
    
    print(ok==ok2)
