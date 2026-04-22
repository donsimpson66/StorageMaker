import tempfile

from fastapi import APIRouter
from fastapi.responses import FileResponse

from ..models import CabinetConfig, GenerateResponse
from ..generator.cabinet import assemble

router = APIRouter(prefix="/api", tags=["generate"])


@router.post("/generate", response_model=GenerateResponse)
def generate_scad(config: CabinetConfig):
    scad_code = assemble(config)
    mode = config.output_mode
    return GenerateResponse(
        scad_code=scad_code,
        filename=f"cabinet_{mode}.scad",
    )


@router.post("/generate/download")
def download_scad(config: CabinetConfig):
    scad_code = assemble(config)
    mode = config.output_mode
    tmp = tempfile.NamedTemporaryFile(
        delete=False, suffix=".scad", prefix="cabinet_"
    )
    tmp.write(scad_code.encode())
    tmp.close()
    return FileResponse(
        tmp.path,
        media_type="application/octet-stream",
        filename=f"cabinet_{mode}.scad",
    )
