/**
 * parseContent.js
 * ---------------
 * Turns raw pasted/uploaded text into a simple array of "blocks".
 * This same array of blocks is used to:
 *   1. Render the live preview (Preview.jsx)
 *   2. Generate the DOCX file (sent to the backend as-is)
 *
 * Supported lightweight markdown-style rules (easy to extend!):
 *   "# Heading"   -> { type: "title" }     (document title, first line usually)
 *   "## Heading"  -> { type: "heading" }   (section heading)
 *   "- item"      -> { type: "bullet" }    (bullet point, "*" also works)
 *   anything else -> { type: "paragraph" }
 *
 * Blank lines simply separate blocks.
 */

export function parseContent(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let paragraphBuffer = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      blocks.push({ type: "paragraph", text: paragraphBuffer.join(" ").trim() });
      paragraphBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      // Blank line = paragraph break
      flushParagraph();
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      blocks.push({ type: "title", text: line.slice(2).trim() });
    } else if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "heading", text: line.slice(3).trim() });
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      flushParagraph();
      blocks.push({ type: "bullet", text: line.slice(2).trim() });
    } else {
      // Regular text line — accumulate into current paragraph
      paragraphBuffer.push(line);
    }
  }

  flushParagraph();

  // If the user never wrote a "# Title" line, promote the very first
  // paragraph/heading into a title so every export still looks complete.
  const hasTitle = blocks.some((b) => b.type === "title");
  if (!hasTitle && blocks.length > 0) {
    blocks[0] = { ...blocks[0], type: "title" };
  }

  return blocks;
}
