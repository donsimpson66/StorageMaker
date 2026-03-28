import type { CabinetConfig, SupportType, OutputMode } from "../types";

interface Props {
  config: CabinetConfig;
  onChange: (config: CabinetConfig) => void;
}

const SUPPORT_OPTIONS: { value: SupportType; label: string }[] = [
  { value: "honeycomb", label: "Honeycomb" },
  { value: "x", label: "X-Brace" },
  { value: "circles", label: "Circles" },
  { value: "squares", label: "Squares" },
  { value: "linear", label: "Linear" },
];

export default function ConfigForm({ config, onChange }: Props) {
  const update = (patch: Partial<CabinetConfig>) => {
    onChange({ ...config, ...patch });
  };

  return (
    <div className="config-form">
      <h2>Cabinet Dimensions</h2>
      <div className="form-grid">
        <label>
          Width (mm)
          <input
            type="number"
            min={10}
            max={1000}
            value={config.width}
            onChange={(e) => update({ width: +e.target.value })}
          />
        </label>
        <label>
          Height (mm)
          <input
            type="number"
            min={10}
            max={1000}
            value={config.height}
            onChange={(e) => update({ height: +e.target.value })}
          />
        </label>
        <label>
          Depth (mm)
          <input
            type="number"
            min={10}
            max={500}
            value={config.depth}
            onChange={(e) => update({ depth: +e.target.value })}
          />
        </label>
        <label>
          Wall Thickness (mm)
          <input
            type="number"
            min={0.5}
            max={10}
            step={0.5}
            value={config.wall_thickness}
            onChange={(e) => update({ wall_thickness: +e.target.value })}
          />
        </label>
      </div>

      <h2>Drawer Layout</h2>
      <div className="form-grid">
        <label>
          Columns (X)
          <input
            type="number"
            min={1}
            max={10}
            value={config.drawers_x}
            onChange={(e) => update({ drawers_x: +e.target.value })}
          />
        </label>
        <label>
          Rows (Y)
          <input
            type="number"
            min={1}
            max={10}
            value={config.drawers_y}
            onChange={(e) => update({ drawers_y: +e.target.value })}
          />
        </label>
        <label>
          Drawer Clearance (mm)
          <input
            type="number"
            min={0.1}
            max={5}
            step={0.1}
            value={config.drawer_clearance}
            onChange={(e) => update({ drawer_clearance: +e.target.value })}
          />
        </label>
      </div>

      <h2>Support Structure</h2>
      <div className="form-grid">
        <label>
          Pattern
          <select
            value={config.support_type}
            onChange={(e) => update({ support_type: e.target.value as SupportType })}
          >
            {SUPPORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Support Thickness (mm)
          <input
            type="number"
            min={0.5}
            max={5}
            step={0.5}
            value={config.support_thickness}
            onChange={(e) => update({ support_thickness: +e.target.value })}
          />
        </label>
      </div>

      <h2>Options</h2>
      <div className="form-grid">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={config.back_panel}
            onChange={(e) => update({ back_panel: e.target.checked })}
          />
          Include Back Panel
        </label>
        <label>
          Output Mode
          <select
            value={config.output_mode}
            onChange={(e) => update({ output_mode: e.target.value as OutputMode })}
          >
            <option value="parametric">Parametric (.scad with variables)</option>
            <option value="resolved">Resolved (hardcoded values)</option>
          </select>
        </label>
      </div>
    </div>
  );
}
