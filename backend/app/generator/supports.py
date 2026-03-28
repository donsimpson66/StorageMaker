def generate_honeycomb(width: float, height: float, thickness: float, cell_size: float = 6.0) -> str:
    lines = []
    cols = int(width / (cell_size * 1.5)) + 1
    rows = int(height / (cell_size * 1.732)) + 1
    lines.append(f"module honeycomb(w, h, t, cs={cell_size}) {{")
    lines.append("  difference() {")
    lines.append("    cube([w, h, t]);")
    lines.append("    for (r = [0 : rows - 1]) {")
    lines.append("      for (c = [0 : cols - 1]) {")
    lines.append("        x_off = c * cs * 1.5;")
    lines.append("        y_off = r * cs * 1.732 + (c % 2 == 1 ? cs * 0.866 : 0);")
    lines.append("        translate([x_off, y_off, -1])")
    lines.append("          cylinder(h = t + 2, r = cs * 0.45, $fn = 6);")
    lines.append("      }")
    lines.append("    }")
    lines.append("  }")
    lines.append("}")
    return "\n".join(lines)


def generate_x_brace(width: float, height: float, thickness: float) -> str:
    return f"""module x_brace(w, h, t) {{
  intersection() {{
    cube([w, h, t]);
    union() {{
      rotate([0, 0, atan2(h, w)])
        translate([0, -h, 0])
        for (i = [-10 : 10])
          translate([i * 8, 0, 0])
          cube([3, h * 3, t]);
      rotate([0, 0, -atan2(h, w)])
        translate([-w, -h, 0])
        for (i = [-10 : 10])
          translate([i * 8, 0, 0])
          cube([3, h * 3, t]);
    }}
  }}
}}"""


def generate_circles(width: float, height: float, thickness: float, radius: float = 4.0) -> str:
    return f"""module circles(w, h, t, r={radius}) {{
  difference() {{
    cube([w, h, t]);
    for (x = [r * 2 : r * 3 : w - r])
      for (y = [r * 2 : r * 3 : h - r])
        translate([x, y, -1])
          cylinder(h = t + 2, r = r, $fn = 32);
  }}
}}"""


def generate_squares(width: float, height: float, thickness: float, size: float = 6.0) -> str:
    return f"""module squares(w, h, t, s={size}) {{
  difference() {{
    cube([w, h, t]);
    for (x = [s : s * 2 : w - s])
      for (y = [s : s * 2 : h - s])
        translate([x - s/2, y - s/2, -1])
          cube([s, s, t + 2]);
  }}
}}"""


def generate_linear(width: float, height: float, thickness: float, spacing: float = 4.0) -> str:
    return f"""module linear_pattern(w, h, t, sp={spacing}) {{
  difference() {{
    cube([w, h, t]);
    for (y = [sp : sp * 2 : h - sp])
      translate([-1, y, -1])
        cube([w + 2, sp * 0.7, t + 2]);
  }}
}}"""


SUPPORT_GENERATORS = {
    "honeycomb": generate_honeycomb,
    "x": generate_x_brace,
    "circles": generate_circles,
    "squares": generate_squares,
    "linear": generate_linear,
}


def get_support_module_name(support_type: str) -> str:
    return {
        "honeycomb": "honeycomb",
        "x": "x_brace",
        "circles": "circles",
        "squares": "squares",
        "linear": "linear_pattern",
    }[support_type]
