from .main import app_backend

@app_backend.get("/hello")
def darkness_my_oldfriend():
    return {"It's": "me"}