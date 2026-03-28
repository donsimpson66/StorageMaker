import tempfile
import subprocess
import os

from fastapi import APIRouter, HTTPException
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


@router.post("/preview")
def preview_stl(config: CabinetConfig):
    scad_code = assemble(config)
    with tempfile.TemporaryDirectory() as tmpdir:
        scad_path = os.path.join(tmpdir, "cabinet.scad")
        stl_path = os.path.join(tmpdir, "cabinet.stl")
        with open(scad_path, "w") as f:
            f.write(scad_code)
        try:
            subprocess.run(
                ["openscad", "-o", stl_path, scad_path],
                capture_output=True,
                text=True,
                timeout=30,
            )
        except FileNotFoundError:
            raise HTTPException(
                status_code=500,
                detail="OpenSCAD not installed on server. Install openscad to enable STL preview.",
            )
        except subprocess.TimeoutExpired:
            raise HTTPException(status_code=500, detail="OpenSCAD render timed out.")
        if not os.path.exists(stl_path):
            raise HTTPException(
                status_code=500,
                detail="OpenSCAD failed to generate STL. Check model geometry.",
            )
        return FileResponse(
            stl_path,
            media_type="application/octet-stream",
            filename="cabinet.stl",
        )
