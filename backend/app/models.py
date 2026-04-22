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


class DrawerInsertConfig(BaseModel):
    cabinet_width: float = 200.0
    cabinet_height: float = 150.0
    cabinet_depth: float = 100.0
    cabinet_wall_thickness: float = 2.0
    drawers_x: int = 2
    drawers_y: int = 1
    drawer_clearance: float = 0.4
    back_panel: bool = True
    fit_clearance: float = 0.6
    insert_wall_thickness: float = 1.6
    floor_thickness: float = 1.2
    compartments_x: int = 2
    compartments_y: int = 2
    output_mode: Literal["parametric", "resolved"] = "parametric"


class GenerateResponse(BaseModel):
    scad_code: str
    filename: str
