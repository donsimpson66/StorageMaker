from http.server import BaseHTTPRequestHandler
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from generator.cabinet import assemble


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

        scad_code = assemble_raw(body)
        result = {
            "scad_code": scad_code,
            "filename": f"cabinet_{body.get('output_mode', 'parametric')}.scad",
        }

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())


def assemble_raw(body: dict) -> str:
    from types import SimpleNamespace
    config = SimpleNamespace(**{
        "width": body.get("width", 200),
        "height": body.get("height", 150),
        "depth": body.get("depth", 100),
        "wall_thickness": body.get("wall_thickness", 2),
        "drawers_x": body.get("drawers_x", 2),
        "drawers_y": body.get("drawers_y", 1),
        "drawer_sizes": body.get("drawer_sizes"),
        "support_type": body.get("support_type", "honeycomb"),
        "support_thickness": body.get("support_thickness", 1),
        "back_panel": body.get("back_panel", True),
        "drawer_clearance": body.get("drawer_clearance", 0.4),
        "output_mode": body.get("output_mode", "parametric"),
    })
    return assemble(config)
