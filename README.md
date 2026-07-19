# 📝 Document Formatter & Exporter

A beginner-friendly full-stack app that turns plain text into a polished,
formatted document — with a live preview, three built-in templates
(Resume, Business Letter, Project Report), and one-click export to both
PDF and DOCX.

## Features

- **Paste or upload** — type directly, or upload a `.txt` / `.md` file
- **3 templates** — Resume, Business Letter, Project Report, each with its own look
- **Live preview** — see the formatted document update as you type
- **Export to PDF** — generated in the browser from the preview (pixel-perfect match)
- **Export to DOCX** — generated on the server as a real, editable Word document
- **Responsive design** — works on desktop, tablet, and mobile

## Tech Stack

| Layer     | Tech                                             |
|-----------|---------------------------------------------------|
| Frontend  | React + Vite, plain CSS (no framework needed)     |
| PDF export| `html2canvas` + `jsPDF` (runs entirely client-side)|
| Backend   | Node.js + Express                                 |
| DOCX export| `docx` npm package (built server-side)           |

## Project Structure

```
document-formatter-exporter/
├── backend/
│   ├── server.js                # Express app entry point
│   ├── routes/
│   │   └── docx.js              # POST /api/docx  -> generates & returns a .docx file
│   ├── templates/
│   │   └── templateStyles.js    # DOCX font/color config per template
│   └── .env.example             # copy to .env (just sets the PORT)
│
└── frontend/
    ├── src/
    │   ├── App.jsx               # main layout, wires everything together
    │   ├── api.js                 # fetch calls to the backend
    │   ├── components/
    │   │   ├── UploadArea.jsx     # paste/upload text
    │   │   ├── TemplateSelector.jsx
    │   │   ├── Preview.jsx        # renders the live formatted preview
    │   │   └── ExportButtons.jsx  # PDF + DOCX export buttons
    │   ├── utils/
    │   │   ├── parseContent.js    # turns raw text into structured "blocks"
    │   │   ├── templates.js       # template metadata + sample content
    │   │   └── exportPdf.js       # client-side PDF generation
    │   └── styles/
    │       ├── index.css          # app layout & UI components
    │       └── templates.css      # per-template document styling
    └── vite.config.js
```

## How It Works

1. The user's text is parsed into a simple list of **blocks**
   (`title`, `heading`, `paragraph`, `bullet`) using a lightweight
   markdown-style syntax: `# Title`, `## Heading`, `- bullet`.
2. Those blocks are rendered in `Preview.jsx`, styled differently depending
   on the selected template (see `templates.css`).
3. **PDF export** takes a snapshot of that exact preview using `html2canvas`
   and lays it onto an A4 page with `jsPDF` — so the PDF always matches
   what's on screen.
4. **DOCX export** sends the same blocks to the backend, which uses the
   `docx` library to build a real, editable Word document with matching
   fonts/colors per template.

## Getting Started

### Prerequisites
- Node.js 18+ installed

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm start
```

The backend runs at `http://localhost:5000`.

### 2. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and automatically proxies
`/api` requests to the backend (see `vite.config.js`).

Open `http://localhost:5173` in your browser — that's it!

## Extending the App

- **Add a new template**: add an entry to `frontend/src/utils/templates.js`,
  a matching `.template-<id>` block in `frontend/src/styles/templates.css`,
  and a matching style entry in `backend/templates/templateStyles.js`.
- **Add a new export format**: add a new route in `backend/routes/` (for
  server-generated formats) or a new utility in `frontend/src/utils/` (for
  browser-generated formats), then wire it into `ExportButtons.jsx`.
- **Change the parsing rules**: everything flows through
  `frontend/src/utils/parseContent.js` — edit it to recognize more markdown
  syntax (e.g. `**bold**`, numbered lists, etc.) and update `Preview.jsx`
  and `backend/routes/docx.js` to render the new block types.

## Notes

- No database is used — everything is processed in memory per request,
  keeping the project simple and stateless.
