import { useState } from "react";
import ConfigForm from "./components/ConfigForm";
import InsertConfigForm from "./components/InsertConfigForm";
import Preview3D from "./components/Preview3D";
import InsertPreview3D from "./components/InsertPreview3D";
import DownloadPanel from "./components/DownloadPanel";
import { downloadInsertScad, downloadScad, generateInsertScad, generateScad } from "./api";
import { buildInsertConfig } from "./insertMath";
import { DEFAULT_CONFIG, DEFAULT_INSERT_OPTIONS } from "./types";
import type { CabinetConfig, DrawerInsertOptions, GeneratorTab } from "./types";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<GeneratorTab>("cabinet");
  const [config, setConfig] = useState<CabinetConfig>(DEFAULT_CONFIG);
  const [insertOptions, setInsertOptions] = useState<DrawerInsertOptions>(
    DEFAULT_INSERT_OPTIONS
  );
  const [cabinetScadCode, setCabinetScadCode] = useState<string>("");
  const [insertScadCode, setInsertScadCode] = useState<string>("");

  const insertConfig = buildInsertConfig(config, insertOptions);

  const handleGenerateCabinet = async () => {
    const response = await generateScad(config);
    return response.scad_code;
  };

  const handleGenerateInsert = async () => {
    const response = await generateInsertScad(insertConfig);
    return response.scad_code;
  };

  const scadCode = activeTab === "cabinet" ? cabinetScadCode : insertScadCode;

  return (
    <div className="app">
      <header>
        <h1>StorageMaker</h1>
        <p>Parametric OpenSCAD cabinet and drawer-insert generator</p>
      </header>
      <main>
        <aside className="sidebar">
          <div className="tab-row">
            <button
              className={activeTab === "cabinet" ? "tab-button active" : "tab-button"}
              onClick={() => setActiveTab("cabinet")}
            >
              Drawer Cabinet
            </button>
            <button
              className={activeTab === "insert" ? "tab-button active" : "tab-button"}
              onClick={() => setActiveTab("insert")}
            >
              Drawer Insert
            </button>
          </div>

          {activeTab === "cabinet" ? (
            <>
              <ConfigForm config={config} onChange={setConfig} />
              <DownloadPanel
                title="Cabinet Output"
                onGenerate={handleGenerateCabinet}
                onDownload={() => downloadScad(config)}
                onCodeGenerated={setCabinetScadCode}
              />
            </>
          ) : (
            <>
              <InsertConfigForm
                config={insertConfig}
                options={insertOptions}
                onChange={setInsertOptions}
              />
              <DownloadPanel
                title="Insert Output"
                generateLabel="Generate Insert .scad"
                downloadLabel="Download Insert .scad"
                onGenerate={handleGenerateInsert}
                onDownload={() => downloadInsertScad(insertConfig)}
                onCodeGenerated={setInsertScadCode}
              />
            </>
          )}
        </aside>
        <section className="content">
          {activeTab === "cabinet" ? (
            <Preview3D config={config} />
          ) : (
            <InsertPreview3D config={insertConfig} />
          )}
          {scadCode && (
            <div className="code-output">
              <h2>
                {activeTab === "cabinet"
                  ? "Generated Cabinet OpenSCAD Code"
                  : "Generated Insert OpenSCAD Code"}
              </h2>
              <pre><code>{scadCode}</code></pre>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
