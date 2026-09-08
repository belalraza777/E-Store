// bill.js
// Generates a polished customer invoice PDF using jsPDF.
// Usage: import { generateCustomerInvoice } from "./bill.js";
//        generateCustomerInvoice(invoiceData)

// Requires jsPDF: https://github.com/parallax/jsPDF

import { jsPDF } from "jspdf";

const FONT_NAME = "helvetica";

// ---- Theme -----------------------------------------------------------
const COLORS = {
  primary: [220, 38, 38],       // header / accent red
  primaryDark: [153, 27, 27],
  text: [51, 51, 51],
  muted: [120, 120, 120],
  border: [230, 220, 220],
  rowAlt: [253, 246, 246],
  totalsBg: [253, 232, 232],
  success: [22, 163, 74],
  warning: [217, 119, 6],
  danger: [220, 38, 38],
  refunded: [37, 99, 235],
};

const PAGE_MARGIN = 18;
const CONTINUATION_TOP = 22; // y-position where content starts on page 2+ (no big header there)

/** Format a number as Indian-grouped currency, e.g. 123456.5 -> "Rs. 1,23,456.50" */
function formatCurrency(amount) {
  const n = Number(amount) || 0;
  const formatted = n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `Rs. ${formatted}`;
}

function formatDate(date) {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Generate a customer invoice PDF and trigger a download.
 * @param {Object} data
 * @param {string} data.storeName
 * @param {string} [data.storeLogo] - base64 image (PNG/JPEG)
 * @param {string} [data.storeAddress] - optional seller address / GSTIN line
 * @param {string} data.invoiceNumber
 * @param {string} data.orderId
 * @param {string} [data.status] - "paid", "pending", "failed", or "refunded" (defaults to "pending")
 * @param {string} data.customerName
 * @param {string} data.customerEmail
 * @param {Array<{name: string, quantity: number, price: number}>} data.products
 * @param {number} data.subtotal
 * @param {number} [data.discount] - total discount amount, if not derivable from subtotal/total
 * @param {number} [data.tax] - optional tax amount
 * @param {string} [data.taxLabel] - label for the tax line, e.g. "GST (18%)"
 * @param {number} data.total
 * @param {string} data.paymentMethod
 * @param {string} data.orderDate
 * @param {string} [data.notes] - optional footer note (return policy, etc.)
 */
export function generateCustomerInvoice(data) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont(FONT_NAME, "normal");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const left = PAGE_MARGIN;
  const right = pageWidth - PAGE_MARGIN;
  const contentWidth = right - left;
  const footerY = pageHeight - 16;

  let page = 1;

  function newPage() {
    doc.addPage();
    page += 1;
    doc.setFont(FONT_NAME, "normal");
    drawFooter();
    return CONTINUATION_TOP;
  }

  function drawFooter() {
    doc.setDrawColor(...COLORS.border);
    doc.line(left, footerY - 6, right, footerY - 6);
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.muted);
    doc.setFont(FONT_NAME, "normal");
    doc.text("Thank you for your business!", left, footerY);
    doc.text(
      `Generated ${new Date().toLocaleDateString("en-IN")}`,
      right,
      footerY,
      { align: "right" }
    );
  }

  function ensureSpace(y, needed) {
    if (y + needed > footerY - 10) {
      return newPage();
    }
    return y;
  }

  // ---- Header ----------------------------------------------------------
  const headerHeight = 42;
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  let logoTextX = left;
  if (data.storeLogo) {
    try {
      doc.addImage(data.storeLogo, left, 10, 16, 16);
      logoTextX = left + 20;
    } catch (e) {
      // ignore broken logo, fall back to text-only header
    }
  }
  doc.setTextColor(255, 255, 255);
  doc.setFont(FONT_NAME, "bold");
  doc.setFontSize(16);
  doc.text(data.storeName || "E-Store", logoTextX, 20);
  if (data.storeAddress) {
    doc.setFont(FONT_NAME, "normal");
    doc.setFontSize(9);
    const addrLines = doc.splitTextToSize(data.storeAddress, 90);
    doc.text(addrLines, logoTextX, 27);
  }

  doc.setFont(FONT_NAME, "bold");
  doc.setFontSize(22);
  doc.text("INVOICE", right, 20, { align: "right" });
  doc.setFontSize(10);
  doc.setFont(FONT_NAME, "normal");
  doc.text(`#${data.invoiceNumber}`, right, 27, { align: "right" });

  const paymentStatus = String(data.status || "pending").toLowerCase();
  const status = paymentStatus.toUpperCase();
  const statusColor = {
    paid: COLORS.success,
    pending: COLORS.warning,
    failed: COLORS.danger,
    refunded: COLORS.refunded,
  }[paymentStatus] || COLORS.warning;
  const totalLabel = {
    paid: "Total Paid",
    pending: "Amount Due",
    failed: "Payment Due",
    refunded: "Amount Refunded",
  }[paymentStatus] || "Amount Due";

  doc.setFillColor(...statusColor);
  const badgeW = doc.getTextWidth(status) + 8;
  doc.roundedRect(right - badgeW, 31, badgeW, 6.5, 1.5, 1.5, "F");
  doc.setFontSize(8.5);
  doc.setFont(FONT_NAME, "bold");
  doc.text(status, right - badgeW / 2, 35.4, { align: "center" });

  let y = headerHeight + 12;

  // ---- Invoice details / Bill To ---------------------------------------
  const boxTop = y - 8;
  const boxHeight = 30;
  doc.setFillColor(...COLORS.rowAlt);
  doc.roundedRect(left, boxTop, contentWidth, boxHeight, 2, 2, "F");

  const col1 = left + 6;
  const col2 = left + contentWidth / 2 + 4;

  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(8.5);
  doc.setFont(FONT_NAME, "bold");
  doc.text("INVOICE DETAILS", col1, y - 1);
  doc.text("BILL TO", col2, y - 1);

  doc.setFont(FONT_NAME, "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.text);
  doc.text(`Order ID: ${data.orderId}`, col1, y + 6);
  doc.text(`Date: ${formatDate(data.orderDate)}`, col1, y + 12);
  doc.text(`Payment: ${data.paymentMethod || "-"}`, col1, y + 18);

  doc.text(data.customerName || "-", col2, y + 6);
  doc.text(data.customerEmail || "-", col2, y + 12);

  y = boxTop + boxHeight + 12;

  // ---- Products table ----------------------------------------------------
  const colQty = right - 62;
  const colPrice = right - 34;
  const colAmount = right;
  const nameColWidth = colQty - col1 - 6;

  function drawTableHeader(yy) {
    doc.setFillColor(...COLORS.primary);
    doc.rect(left, yy - 5.5, contentWidth, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont(FONT_NAME, "bold");
    doc.setFontSize(9);
    doc.text("PRODUCT", left + 3, yy);
    doc.text("QTY", colQty, yy, { align: "right" });
    doc.text("UNIT PRICE", colPrice, yy, { align: "right" });
    doc.text("AMOUNT", colAmount - 3, yy, { align: "right" });
    return yy + 8;
  }

  y = drawTableHeader(y);
  doc.setFont(FONT_NAME, "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.text);

  const products = Array.isArray(data.products) ? data.products : [];
  products.forEach((item, index) => {
    const nameLines = doc.splitTextToSize(item.name || "Product", nameColWidth);
    const rowHeight = Math.max(8, nameLines.length * 5 + 3);

    const yBefore = y;
    y = ensureSpace(y, rowHeight);
    const brokeToNewPage = y !== yBefore && y === CONTINUATION_TOP;
    if (brokeToNewPage && index > 0) {
      y = drawTableHeader(y);
      doc.setFont(FONT_NAME, "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...COLORS.text);
    }

    if (index % 2 === 0) {
      doc.setFillColor(...COLORS.rowAlt);
      doc.rect(left, y - 4.5, contentWidth, rowHeight, "F");
    }

    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const amount = qty * price;

    doc.text(nameLines, left + 3, y);
    doc.text(String(qty), colQty, y, { align: "right" });
    doc.text(formatCurrency(price), colPrice, y, { align: "right" });
    doc.text(formatCurrency(amount), colAmount - 3, y, { align: "right" });

    y += rowHeight;
  });

  doc.setDrawColor(...COLORS.border);
  doc.line(left, y, right, y);
  y += 8;

  // ---- Totals ------------------------------------------------------------
  y = ensureSpace(y, 42);
  const totalsLabelX = right - 55;
  const totalsBoxTop = y - 6;

  const subtotal = Number(data.subtotal) || 0;
  const total = Number(data.total) || 0;
  const discount =
    data.discount != null ? Number(data.discount) : Math.max(0, subtotal - total - (Number(data.tax) || 0));
  const tax = Number(data.tax) || 0;

  let totalsLines = 1; // subtotal always shown
  if (discount > 0) totalsLines += 1;
  if (tax > 0) totalsLines += 1;
  const totalsBoxHeight = totalsLines * 7 + 12;

  doc.setFillColor(...COLORS.totalsBg);
  doc.roundedRect(totalsLabelX - 8, totalsBoxTop, right - (totalsLabelX - 8), totalsBoxHeight, 2, 2, "F");

  let ty = totalsBoxTop + 7;
  doc.setFontSize(9.5);
  doc.setFont(FONT_NAME, "normal");
  doc.setTextColor(...COLORS.text);
  doc.text("Subtotal", totalsLabelX, ty, { align: "right" });
  doc.text(formatCurrency(subtotal), right - 4, ty, { align: "right" });
  ty += 7;

  if (discount > 0) {
    doc.text("Discount", totalsLabelX, ty, { align: "right" });
    doc.text(`-${formatCurrency(discount)}`, right - 4, ty, { align: "right" });
    ty += 7;
  }
  if (tax > 0) {
    doc.text(data.taxLabel || "Tax", totalsLabelX, ty, { align: "right" });
    doc.text(formatCurrency(tax), right - 4, ty, { align: "right" });
    ty += 7;
  }

  doc.setDrawColor(...COLORS.primary);
  doc.line(totalsLabelX - 8, ty - 4, right - 4, ty - 4);
  ty += 3.5;
  doc.setFont(FONT_NAME, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.primaryDark);
  doc.text(totalLabel, totalsLabelX, ty, { align: "right" });
  doc.text(formatCurrency(total), right - 4, ty, { align: "right" });

  y = totalsBoxTop + totalsBoxHeight + 10;

  // ---- Notes ---------------------------------------------------------
  if (data.notes) {
    y = ensureSpace(y, 12);
    doc.setFont(FONT_NAME, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.muted);
    const noteLines = doc.splitTextToSize(data.notes, contentWidth);
    doc.text(noteLines, left, y);
  }

  drawFooter();

  // ---- Page numbers (now that total page count is known) --------------
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont(FONT_NAME, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.muted);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth / 2, footerY, { align: "center" });
  }

  doc.save(`Invoice_${data.invoiceNumber}.pdf`);
  return doc;
}
