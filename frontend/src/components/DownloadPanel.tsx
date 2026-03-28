import { useState } from "react";
import type { CabinetConfig } from "../types";
import { downloadScad, generateScad } from "../api";

interface Props {
  config: CabinetConfig;
  onCodeGenerated: (code: string) => void;
}

export default function DownloadPanel({ config, onCodeGenerated }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading("generate");
    setError(null);
    try {
      const res = await generateScad(config);
      onCodeGenerated(res.scad_code);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(null);
    }
  };

  const handleDownloadScad = async () => {
    setLoading("scad");
    setError(null);
    try {
      await downloadScad(config);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Download failed");
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
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
