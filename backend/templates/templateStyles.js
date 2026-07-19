/**
 * templateStyles.js
 * ------------------
 * Defines how each template (Resume, Business Letter, Project Report)
 * should look when exported to DOCX.
 *
 * To add a NEW template:
 *   1. Add a new key below (e.g. "coverLetter") with its own style config.
 *   2. Make sure the frontend sends the same key as `template`.
 * That's it — the docx export route (routes/docx.js) will pick it up automatically.
 */

const TEMPLATE_STYLES = {
  resume: {
    titleColor: "1F2937", // dark slate
    titleSize: 44, // half-points (22pt)
    headingColor: "4338CA", // indigo
    headingSize: 26, // 13pt
    bodyFont: "Calibri",
    headingFont: "Calibri",
    bodySize: 22, // 11pt
  },
  letter: {
    titleColor: "1F2937",
    titleSize: 32, // 16pt
    headingColor: "1F2937",
    headingSize: 24, // 12pt
    bodyFont: "Georgia",
    headingFont: "Georgia",
    bodySize: 22,
  },
  report: {
    titleColor: "111827",
    titleSize: 48, // 24pt
    headingColor: "0F766E", // teal
    headingSize: 28, // 14pt
    bodyFont: "Cambria",
    headingFont: "Cambria",
    bodySize: 22,
  },
};

// Fallback style used if an unknown template key is sent
const DEFAULT_STYLE = TEMPLATE_STYLES.report;

function getDocxStyle(template) {
  return TEMPLATE_STYLES[template] || DEFAULT_STYLE;
}

module.exports = { getDocxStyle, TEMPLATE_STYLES };
