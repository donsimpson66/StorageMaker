import type { CabinetConfig, DrawerInsertConfig, GenerateResponse } from "./types";

const API_BASE = "/api";

export async function generateScad(config: CabinetConfig): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function generateInsertScad(
  config: DrawerInsertConfig
): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE}/generate/insert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function downloadScad(config: CabinetConfig): Promise<void> {
  const res = await generateScad(config);
  const blob = new Blob([res.scad_code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = res.filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadInsertScad(config: DrawerInsertConfig): Promise<void> {
  const res = await generateInsertScad(config);
  const blob = new Blob([res.scad_code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = res.filename;
  a.click();
  URL.revokeObjectURL(url);
}
