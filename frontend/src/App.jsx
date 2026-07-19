import React, { useState, useMemo, useRef } from "react";
import UploadArea from "./components/UploadArea";
import TemplateSelector from "./components/TemplateSelector";
import Preview from "./components/Preview";
import ExportButtons from "./components/ExportButtons";
import { parseContent } from "./utils/parseContent";
import { getTemplateById } from "./utils/templates";

export default function App() {
  const [text, setText] = useState("");
  const [template, setTemplate] = useState("resume");
  const previewRef = useRef(null);

  // Re-parse the content into blocks whenever the text changes.
  // useMemo avoids re-parsing on every render if text hasn't changed.
  const blocks = useMemo(() => parseContent(text), [text]);

  const handleLoadSample = () => {
    setText(getTemplateById(template).sample);
  };

  // Filename based on the document's title block (if present)
  const filename = useMemo(() => {
    const titleBlock = blocks.find((b) => b.type === "title");
    if (!titleBlock) return "document";
    return titleBlock.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "document";
  }, [blocks]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>📝 Document Formatter & Exporter</h1>
          <p>Paste your content, pick a template, and export a polished PDF or Word doc.</p>
        </div>
      </header>

      <main className="app-main">
        {/* LEFT: input controls */}
        <section className="left-panel">
          <UploadArea text={text} onTextChange={setText} onLoadSample={handleLoadSample} />
          <TemplateSelector selected={template} onSelect={setTemplate} />
        </section>

        {/* RIGHT: live preview + export */}
        <section className="right-panel">
          <div className="card preview-card">
            <div className="card-header">
              <h2>Live Preview</h2>
            </div>
            <Preview ref={previewRef} blocks={blocks} template={template} />
          </div>
          <ExportButtons
            previewRef={previewRef}
            blocks={blocks}
            template={template}
            filename={filename}
          />
        </section>
      </main>

      <footer className="app-footer">
        Built with React + Express · PDF export runs in your browser · DOCX generated on the server
      </footer>

    </div>
  );
}
