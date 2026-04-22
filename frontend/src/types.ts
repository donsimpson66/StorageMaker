export type SupportType = "x" | "honeycomb" | "circles" | "squares" | "linear";
export type OutputMode = "parametric" | "resolved";
export type GeneratorTab = "cabinet" | "insert";

export interface CabinetConfig {
  width: number;
  height: number;
  depth: number;
  wall_thickness: number;
  drawers_x: number;
  drawers_y: number;
  drawer_sizes: number[] | null;
  support_type: SupportType;
  support_thickness: number;
  back_panel: boolean;
  drawer_clearance: number;
  output_mode: OutputMode;
}

export interface GenerateResponse {
  scad_code: string;
  filename: string;
}

export interface DrawerInsertOptions {
  fit_clearance: number;
  insert_wall_thickness: number;
  floor_thickness: number;
  compartments_x: number;
  compartments_y: number;
  output_mode: OutputMode;
}

export interface DrawerInsertConfig extends DrawerInsertOptions {
  cabinet_width: number;
  cabinet_height: number;
  cabinet_depth: number;
  cabinet_wall_thickness: number;
  drawers_x: number;
  drawers_y: number;
  drawer_clearance: number;
  back_panel: boolean;
}

export const DEFAULT_CONFIG: CabinetConfig = {
  width: 200,
  height: 150,
  depth: 100,
  wall_thickness: 2,
  drawers_x: 2,
  drawers_y: 1,
  drawer_sizes: null,
  support_type: "honeycomb",
  support_thickness: 1,
  back_panel: true,
  drawer_clearance: 0.4,
  output_mode: "parametric",
};

export const DEFAULT_INSERT_OPTIONS: DrawerInsertOptions = {
  fit_clearance: 0.6,
  insert_wall_thickness: 1.6,
  floor_thickness: 1.2,
  compartments_x: 2,
  compartments_y: 2,
  output_mode: "parametric",
};
