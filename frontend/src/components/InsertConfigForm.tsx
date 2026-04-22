import type { DrawerInsertConfig, DrawerInsertOptions, OutputMode } from "../types";
import { calculateInsertDimensions } from "../insertMath";

interface Props {
  config: DrawerInsertConfig;
  options: DrawerInsertOptions;
  onChange: (options: DrawerInsertOptions) => void;
}

export default function InsertConfigForm({ config, options, onChange }: Props) {
  const update = (patch: Partial<DrawerInsertOptions>) => {
    onChange({ ...options, ...patch });
  };

  const dimensions = calculateInsertDimensions(config);

  return (
    <div className="config-form">
      <h2>Derived Drawer Section</h2>
      <div className="derived-card">
        <p>Using the current cabinet layout from the cabinet tab.</p>
        <div className="derived-grid">
          <span>Section Width</span>
          <strong>{dimensions.sectionWidth.toFixed(1)} mm</strong>
          <span>Section Height</span>
          <strong>{dimensions.sectionHeight.toFixed(1)} mm</strong>
          <span>Section Depth</span>
          <strong>{dimensions.sectionDepth.toFixed(1)} mm</strong>
        </div>
      </div>

      <h2>Insert Layout</h2>
      <div className="form-grid">
        <label>
          Fit Clearance (mm)
          <input
            type="number"
            min={0.1}
            max={5}
            step={0.1}
            value={options.fit_clearance}
            onChange={(e) => update({ fit_clearance: +e.target.value })}
          />
        </label>
        <label>
          Wall Thickness (mm)
          <input
            type="number"
            min={0.8}
            max={6}
            step={0.1}
            value={options.insert_wall_thickness}
            onChange={(e) => update({ insert_wall_thickness: +e.target.value })}
          />
        </label>
        <label>
          Floor Thickness (mm)
          <input
            type="number"
            min={0.8}
            max={6}
            step={0.1}
            value={options.floor_thickness}
            onChange={(e) => update({ floor_thickness: +e.target.value })}
          />
        </label>
        <label>
          Output Mode
          <select
            value={options.output_mode}
            onChange={(e) => update({ output_mode: e.target.value as OutputMode })}
          >
            <option value="parametric">Parametric (.scad with variables)</option>
            <option value="resolved">Resolved (hardcoded values)</option>
          </select>
        </label>
      </div>

      <h2>Final Insert Size</h2>
      <div className="derived-card accent-card">
        <div className="derived-grid">
          <span>Insert Width</span>
          <strong>{dimensions.insertWidth.toFixed(1)} mm</strong>
          <span>Insert Height</span>
          <strong>{dimensions.insertHeight.toFixed(1)} mm</strong>
          <span>Insert Depth</span>
          <strong>{dimensions.insertDepth.toFixed(1)} mm</strong>
        </div>
      </div>
    </div>
  );
}