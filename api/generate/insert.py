from http.server import BaseHTTPRequestHandler
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from generator.insert import assemble_insert


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(content_length)
        body = json.loads(raw) if raw else {}

        scad_code = assemble_insert_raw(body)
        result = {
            "scad_code": scad_code,
            "filename": f"drawer_insert_{body.get('output_mode', 'parametric')}.scad",
        }

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())


def assemble_insert_raw(body: dict) -> str:
    from types import SimpleNamespace

    config = SimpleNamespace(
        **{
            "cabinet_width": body.get("cabinet_width", 200),
            "cabinet_height": body.get("cabinet_height", 150),
            "cabinet_depth": body.get("cabinet_depth", 100),
            "cabinet_wall_thickness": body.get("cabinet_wall_thickness", 2),
            "drawers_x": body.get("drawers_x", 2),
            "drawers_y": body.get("drawers_y", 1),
            "drawer_clearance": body.get("drawer_clearance", 0.4),
            "back_panel": body.get("back_panel", True),
            "fit_clearance": body.get("fit_clearance", 0.6),
            "insert_wall_thickness": body.get("insert_wall_thickness", 1.6),
            "floor_thickness": body.get("floor_thickness", 1.2),
            "compartments_x": body.get("compartments_x", 2),
            "compartments_y": body.get("compartments_y", 2),
            "output_mode": body.get("output_mode", "parametric"),
        }
    )
    return assemble_insert(config)