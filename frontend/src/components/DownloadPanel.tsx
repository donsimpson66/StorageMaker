import { useState } from "react";

interface Props {
  title: string;
  generateLabel?: string;
  downloadLabel?: string;
  onGenerate: () => Promise<string>;
  onDownload: () => Promise<void>;
  onCodeGenerated: (code: string) => void;
}

export default function DownloadPanel({
  title,
  generateLabel = "Generate .scad Code",
  downloadLabel = "Download .scad",
  onGenerate,
  onDownload,
  onCodeGenerated,
}: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading("generate");
    setError(null);
    try {
      const code = await onGenerate();
      onCodeGenerated(code);
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
      await onDownload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Download failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="download-panel">
      <h2>{title}</h2>
      <div className="button-row">
        <button onClick={handleGenerate} disabled={!!loading}>
          {loading === "generate" ? "Generating..." : generateLabel}
        </button>
        <button onClick={handleDownloadScad} disabled={!!loading}>
          {loading === "scad" ? "Downloading..." : downloadLabel}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
