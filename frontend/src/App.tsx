import { useState } from "react";
import ConfigForm from "./components/ConfigForm";
import Preview3D from "./components/Preview3D";
import DownloadPanel from "./components/DownloadPanel";
import { DEFAULT_CONFIG } from "./types";
import type { CabinetConfig } from "./types";
import "./App.css";

function App() {
  const [config, setConfig] = useState<CabinetConfig>(DEFAULT_CONFIG);
  const [scadCode, setScadCode] = useState<string>("");

  return (
    <div className="app">
      <header>
        <h1>StorageMaker</h1>
        <p>Parametric OpenSCAD Drawer &amp; Shelf Generator</p>
      </header>
      <main>
        <aside className="sidebar">
          <ConfigForm config={config} onChange={setConfig} />
          <DownloadPanel
            config={config}
            onCodeGenerated={setScadCode}
          />
        </aside>
        <section className="content">
          <Preview3D config={config} />
          {scadCode && (
            <div className="code-output">
              <h2>Generated OpenSCAD Code</h2>
              <pre><code>{scadCode}</code></pre>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
