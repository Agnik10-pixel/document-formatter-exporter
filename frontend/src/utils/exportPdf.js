/**
 * exportPdf.js
 * ------------
 * Exports the live preview DOM node as a PDF, entirely in the browser.
 *
 * How it works:
 *   1. html2canvas takes a high-resolution "screenshot" of the preview element.
 *   2. jsPDF places that image onto A4 page(s), splitting it into multiple
 *      pages automatically if the content is taller than one page.
 *
 * This guarantees the PDF looks EXACTLY like the live preview (same fonts,
 * colors, and spacing), since it's a direct visual capture.
 */

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportPreviewAsPdf(previewElement, filename = "document") {
  if (!previewElement) {
    throw new Error("Preview element not found.");
  }

  // Render the preview at 2x scale for crisp text in the PDF
  const canvas = await html2canvas(previewElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Scale the captured image to fit the PDF's width
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Add the first page
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Add extra pages if content overflows one A4 page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight; // negative offset to show the next slice
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${filename}.pdf`);
}
