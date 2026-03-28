import { useState } from "react";
import type { CabinetConfig } from "../types";
import { downloadScad, downloadStl, generateScad } from "../api";

interface Props {
  config: CabinetConfig;
  onCodeGenerated: (code: string) => void;
  onStlGenerated: (url: string) => void;
}

export default function DownloadPanel({ config, onCodeGenerated, onStlGenerated }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading("generate");
    setError(null);
    try {
      const res = await generateScad(config);
      onCodeGenerated(res.scad_code);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  };

  const handleDownloadScad = async () => {
    setLoading("scad");
    setError(null);
    try {
      await downloadScad(config);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  };

  const handleDownloadStl = async () => {
    setLoading("stl");
    setError(null);
    try {
      await downloadStl(config);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="download-panel">
      <div className="button-row">
        <button onClick={handleGenerate} disabled={!!loading}>
          {loading === "generate" ? "Generating..." : "Generate .scad Code"}
        </button>
        <button onClick={handleDownloadScad} disabled={!!loading}>
          {loading === "scad" ? "Downloading..." : "Download .scad"}
        </button>
        <button onClick={handleDownloadStl} disabled={!!loading} className="secondary">
          {loading === "stl" ? "Rendering..." : "Download STL"}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
