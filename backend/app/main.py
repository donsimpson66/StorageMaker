from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.generate import router as generate_router

app = FastAPI(title="StorageMaker", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate_router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
