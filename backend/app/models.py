from typing import Literal
from pydantic import BaseModel


class CabinetConfig(BaseModel):
    width: float = 200.0
    height: float = 150.0
    depth: float = 100.0
    wall_thickness: float = 2.0
    drawers_x: int = 2
    drawers_y: int = 1
    drawer_sizes: list[float] | None = None
    support_type: Literal["x", "honeycomb", "circles", "squares", "linear"] = "honeycomb"
    support_thickness: float = 1.0
    back_panel: bool = True
    drawer_clearance: float = 0.4
    output_mode: Literal["parametric", "resolved"] = "parametric"


class GenerateResponse(BaseModel):
    scad_code: str
    filename: str
