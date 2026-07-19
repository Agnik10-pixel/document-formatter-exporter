/**
 * server.js
 * ---------
 * Entry point for the Document Formatter & Exporter backend.
 *
 * Responsibility: serve the DOCX export endpoint (routes/docx.js), which
 * takes parsed content blocks and returns a real Word document.
 *
 * PDF export is handled entirely on the FRONTEND (see frontend/src/utils/exportPdf.js)
 * using html2canvas + jsPDF, so no heavy PDF library is needed on the server.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const docxRoute = require("./routes/docx");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the React frontend (different port during development) to call this API
app.use(cors());

// Increase JSON body limit since documents can be fairly long
app.use(express.json({ limit: "5mb" }));

// Simple health check — useful for confirming the server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Document Formatter backend is running." });
});

// Feature routes
app.use("/api/docx", docxRoute);

app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
