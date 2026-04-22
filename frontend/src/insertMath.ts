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
    config.cabinet_width / config.drawers_x,
    1
  );
  const sectionHeight = Math.max(
    config.cabinet_height / config.drawers_y,
    1
  );
  const sectionDepth = Math.max(config.cabinet_depth, 1);

  return {
    sectionWidth,
    sectionHeight,
    sectionDepth,
    insertWidth: Math.max(
      sectionWidth - config.fit_clearance,
      config.insert_wall_thickness * 2 + 1
    ),
    insertHeight: Math.max(
      sectionHeight - config.fit_clearance,
      config.insert_wall_thickness * 2 + 1
    ),
    insertDepth: Math.max(
      sectionDepth - config.fit_clearance,
      config.floor_thickness + 1
    ),
  };
}