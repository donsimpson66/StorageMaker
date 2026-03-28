from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .models import CabinetConfig, GenerateResponse
from .generator.cabinet import assemble

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/generate")
def generate_scad(config: CabinetConfig):
    scad_code = assemble(config)
    return GenerateResponse(
        scad_code=scad_code,
        filename=f"cabinet_{config.output_mode}.scad",
    )
