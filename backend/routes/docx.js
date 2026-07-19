/**
 * routes/docx.js
 * --------------
 * POST /api/docx
 *
 * Receives the already-parsed content "blocks" from the frontend
 * (the same blocks used to render the live preview) plus the chosen
 * template, builds a real Word document with the `docx` library,
 * and streams it back as a downloadable .docx file.
 *
 * Expected request body:
 * {
 *   "template": "resume" | "letter" | "report",
 *   "filename": "my-document",
 *   "blocks": [
 *     { "type": "title", "text": "..." },
 *     { "type": "heading", "text": "..." },
 *     { "type": "paragraph", "text": "..." },
 *     { "type": "bullet", "text": "..." }
 *   ]
 * }
 */

const express = require("express");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} = require("docx");
const { getDocxStyle } = require("../templates/templateStyles");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { blocks, template, filename } = req.body;

    if (!Array.isArray(blocks) || blocks.length === 0) {
      return res.status(400).json({ error: "No content blocks provided." });
    }

    const style = getDocxStyle(template);

    // Business letters look better with a right-aligned date at the top.
    const isLetter = template === "letter";
    const paragraphs = [];

    if (isLetter) {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              text: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              font: style.bodyFont,
              size: style.bodySize,
            }),
          ],
          spacing: { after: 300 },
        })
      );
    }

    // Convert each parsed block into a docx Paragraph
    blocks.forEach((block) => {
      switch (block.type) {
        case "title":
          paragraphs.push(
            new Paragraph({
              alignment: template === "report" ? AlignmentType.CENTER : AlignmentType.LEFT,
              spacing: { after: 240 },
              children: [
                new TextRun({
                  text: block.text,
                  bold: true,
                  color: style.titleColor,
                  size: style.titleSize,
                  font: style.headingFont,
                }),
              ],
            })
          );
          break;

        case "heading":
          paragraphs.push(
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 240, after: 120 },
              children: [
                new TextRun({
                  text: block.text,
                  bold: true,
                  color: style.headingColor,
                  size: style.headingSize,
                  font: style.headingFont,
                }),
              ],
            })
          );
          break;

        case "bullet":
          paragraphs.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: block.text,
                  font: style.bodyFont,
                  size: style.bodySize,
                }),
              ],
            })
          );
          break;

        case "paragraph":
        default:
          paragraphs.push(
            new Paragraph({
              alignment: isLetter ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
              spacing: { after: 160 },
              children: [
                new TextRun({
                  text: block.text,
                  font: style.bodyFont,
                  size: style.bodySize,
                }),
              ],
            })
          );
          break;
      }
    });

    // Business letters get a closing signature block automatically
    if (isLetter) {
      paragraphs.push(
        new Paragraph({ text: "", spacing: { before: 300 } }),
        new Paragraph({
          children: [
            new TextRun({ text: "Sincerely,", font: style.bodyFont, size: style.bodySize }),
          ],
        })
      );
    }

    const doc = new Document({
      sections: [{ properties: {}, children: paragraphs }],
    });

    const buffer = await Packer.toBuffer(doc);
    const safeName = (filename || "document").replace(/[^a-z0-9\-_]/gi, "_");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}.docx"`);
    res.send(buffer);
  } catch (err) {
    console.error("DOCX generation failed:", err);
    res.status(500).json({ error: "Failed to generate DOCX file." });
  }
});

module.exports = router;
