/**
 * api.js
 * ------
 * All network calls to the backend live here in one place.
 * In development, "/api" is proxied to http://localhost:5000 by Vite (see vite.config.js).
 * In production, set VITE_API_URL to your deployed backend's base URL.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Ask the backend to generate and return a .docx file (as a Blob)
export async function downloadDocx(blocks, template, filename) {
  const res = await fetch(`${BASE_URL}/docx`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks, template, filename }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to generate DOCX.");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.docx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
