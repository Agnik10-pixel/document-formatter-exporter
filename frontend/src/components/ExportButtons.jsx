import React, { useState } from "react";
import { exportPreviewAsPdf } from "../utils/exportPdf";
import { downloadDocx } from "../api";

/**
 * ExportButtons
 * -------------
 * Two export actions:
 *  - PDF: generated fully in the browser from the preview DOM (exact visual match)
 *  - DOCX: generated on the backend from the structured content blocks (editable Word doc)
 */
export default function ExportButtons({ previewRef, blocks, template, filename }) {
  const [loading, setLoading] = useState(null); // "pdf" | "docx" | null
  const [error, setError] = useState("");

  const disabled = blocks.length === 0;

  const handlePdfExport = async () => {
    setError("");
    setLoading("pdf");
    try {
      await exportPreviewAsPdf(previewRef.current, filename);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleDocxExport = async () => {
    setError("");
    setLoading("docx");
    try {
      await downloadDocx(blocks, template, filename);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="export-section">
      <div className="export-buttons">
        <button
          type="button"
          className="primary-btn"
          disabled={disabled || loading}
          onClick={handlePdfExport}
        >
          {loading === "pdf" ? "Generating PDF..." : "⬇ Export as PDF"}
        </button>
        <button
          type="button"
          className="primary-btn secondary-color"
          disabled={disabled || loading}
          onClick={handleDocxExport}
        >
          {loading === "docx" ? "Generating DOCX..." : "⬇ Export as DOCX"}
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
