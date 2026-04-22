import type { CabinetConfig, DrawerInsertConfig, DrawerInsertOptions } from "./types";

export function buildInsertConfig(
  cabinetConfig: CabinetConfig,
  insertOptions: DrawerInsertOptions
): DrawerInsertConfig {
  return {
    cabinet_width: cabinetConfig.width,
    cabinet_height: cabinetConfig.height,
    cabinet_depth: cabinetConfig.depth,
    cabinet_wall_thickness: cabinetConfig.wall_thickness,
    drawers_x: cabinetConfig.drawers_x,
    drawers_y: cabinetConfig.drawers_y,
    drawer_clearance: cabinetConfig.drawer_clearance,
    back_panel: cabinetConfig.back_panel,
    ...insertOptions,
  };
}

export function calculateInsertDimensions(config: DrawerInsertConfig) {
  const sectionWidth = Math.max(
    (config.cabinet_width
      - 2 * config.cabinet_wall_thickness
      - (config.drawers_x + 1) * config.drawer_clearance)
      / config.drawers_x,
    1
  );
  const sectionHeight = Math.max(
    (config.cabinet_height
      - 2 * config.cabinet_wall_thickness
      - (config.drawers_y + 1) * config.drawer_clearance)
      / config.drawers_y,
    1
  );
  const sectionDepth = Math.max(
    config.cabinet_depth
      - config.drawer_clearance
      - (config.back_panel ? config.cabinet_wall_thickness : 0),
    1
  );

  return {
    sectionWidth,
    sectionHeight,
    sectionDepth,
    insertWidth: Math.max(
      sectionWidth - 2 * config.fit_clearance,
      config.insert_wall_thickness * 2 + 1
    ),
    insertHeight: Math.max(
      sectionHeight - 2 * config.fit_clearance,
      config.insert_wall_thickness * 2 + 1
    ),
    insertDepth: Math.max(
      sectionDepth - 2 * config.fit_clearance,
      config.floor_thickness + 1
    ),
  };
}