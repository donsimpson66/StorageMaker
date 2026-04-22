import tempfile

from fastapi import APIRouter
from fastapi.responses import FileResponse

from ..models import CabinetConfig, DrawerInsertConfig, GenerateResponse
from ..generator.cabinet import assemble
from ..generator.insert import assemble_insert

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


@router.post("/generate/insert", response_model=GenerateResponse)
def generate_insert_scad(config: DrawerInsertConfig):
    scad_code = assemble_insert(config)
    mode = config.output_mode
    return GenerateResponse(
        scad_code=scad_code,
        filename=f"drawer_insert_{mode}.scad",
    )


@router.post("/generate/insert/download")
def download_insert_scad(config: DrawerInsertConfig):
    scad_code = assemble_insert(config)
    mode = config.output_mode
    tmp = tempfile.NamedTemporaryFile(
        delete=False, suffix=".scad", prefix="drawer_insert_"
    )
    tmp.write(scad_code.encode())
    tmp.close()
    return FileResponse(
        tmp.path,
        media_type="application/octet-stream",
        filename=f"drawer_insert_{mode}.scad",
    )
