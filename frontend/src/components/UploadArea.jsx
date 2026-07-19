import React, { useRef } from "react";

/**
 * UploadArea
 * ----------
 * Lets the user either paste text directly into a textarea,
 * or upload a .txt / .md file (read using the browser's FileReader API).
 */
export default function UploadArea({ text, onTextChange, onLoadSample }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only allow plain text / markdown files
    const validExtensions = [".txt", ".md"];
    const isValid = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!isValid) {
      alert("Please upload a .txt or .md file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => onTextChange(event.target.result);
    reader.onerror = () => alert("Could not read the file. Please try again.");
    reader.readAsText(file);

    // Reset input so the same file can be re-uploaded if needed
    e.target.value = "";
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>1. Add Your Content</h2>
        <button className="link-btn" onClick={onLoadSample} type="button">
          Load sample
        </button>
      </div>

      <textarea
        className="text-input"
        placeholder={`Paste your text here...\n\nTip: start a line with "# " for a title, "## " for a section heading, and "- " for bullet points.`}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        rows={10}
      />

      <div className="upload-row">
        <button
          type="button"
          className="secondary-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          📁 Upload .txt / .md file
        </button>
        <input
          type="file"
          accept=".txt,.md"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        {text && (
          <button type="button" className="link-btn" onClick={() => onTextChange("")}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
