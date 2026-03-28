def generate_drawer(
    width: float,
    height: float,
    depth: float,
    wall: float,
    clearance: float,
    parametric: bool = False,
) -> str:
    if parametric:
        return """module drawer(dw, dh, dd, wall, clearance) {
  inner_w = dw - 2 * wall;
  inner_d = dd - 2 * wall;
  difference() {
    cube([dw, dh, dd]);
    translate([wall, wall, wall])
      cube([inner_w, dh - wall, inner_d]);
    translate([wall, wall, -1])
      cube([inner_w, dh - wall * 2, dd + 2]);
  }
  // bottom groove
  translate([wall, 0, wall])
    cube([inner_w, wall * 0.5, inner_d]);
}"""
    else:
        inner_w = width - 2 * wall
        inner_d = depth - 2 * wall
        groove_h = wall * 0.5
        return f"""module drawer() {{
  difference() {{
    cube([{width}, {height}, {depth}]);
    translate([{wall}, {wall}, {wall}])
      cube([{inner_w}, {height - wall}, {inner_d}]);
    translate([{wall}, {wall}, -1])
      cube([{inner_w}, {height - wall * 2}, {depth + 2}]);
  }}
  translate([{wall}, 0, {wall}])
    cube([{inner_w}, {groove_h}, {inner_d}]);
}}"""
