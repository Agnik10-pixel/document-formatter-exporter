import React, { forwardRef } from "react";

/**
 * Preview
 * -------
 * Renders the parsed content blocks styled according to the selected template.
 * Wrapped in forwardRef so the parent (App.jsx) can pass this DOM node to
 * html2canvas for PDF export — this guarantees "what you see is what you export".
 */
const Preview = forwardRef(({ blocks, template }, ref) => {
  const isEmpty = blocks.length === 0;

  return (
    <div className="preview-wrapper">
      <div ref={ref} className={`preview-page template-${template}`}>
        {isEmpty ? (
          <p className="preview-placeholder">
            Your formatted document will appear here as you type...
          </p>
        ) : (
          groupBullets(blocks).map((item, i) => {
            if (item.type === "bulletGroup") {
              return (
                <ul key={i} className="doc-bullet-wrapper">
                  {item.items.map((text, j) => (
                    <li key={j} className="doc-bullet">
                      {text}
                    </li>
                  ))}
                </ul>
              );
            }
            if (item.type === "title") {
              return (
                <h1 key={i} className="doc-title">
                  {item.text}
                </h1>
              );
            }
            if (item.type === "heading") {
              return (
                <h2 key={i} className="doc-heading">
                  {item.text}
                </h2>
              );
            }
            return (
              <p key={i} className="doc-paragraph">
                {item.text}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
});

// Groups consecutive { type: "bullet" } blocks into a single bulletGroup
// so they render as ONE <ul> instead of one <ul> per item.
function groupBullets(blocks) {
  const result = [];
  let currentGroup = null;

  for (const block of blocks) {
    if (block.type === "bullet") {
      if (!currentGroup) {
        currentGroup = { type: "bulletGroup", items: [] };
        result.push(currentGroup);
      }
      currentGroup.items.push(block.text);
    } else {
      currentGroup = null;
      result.push(block);
    }
  }
  return result;
}

export default Preview;
