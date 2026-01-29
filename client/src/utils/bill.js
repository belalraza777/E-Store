// customerInvoice.js
// Utility to generate a customer invoice PDF using jsPDF
// Usage: import and call generateCustomerInvoice(invoiceData)
// Requires jsPDF: https://github.com/parallax/jsPDF

import jsPDF from "jspdf";

/**
 * Generate a customer invoice PDF and trigger download
 * @param {Object} data - Invoice data from backend
 * @param {string} data.storeName
 * @param {string} [data.storeLogo] - (optional) base64 image string
 * @param {string} data.invoiceNumber
 * @param {string} data.orderId
 * @param {string} data.customerName
 * @param {string} data.customerEmail
 * @param {Array<{name: string, quantity: number, price: number}>} data.products
 * @param {number} data.subtotal
 * @param {number} data.total
 * @param {string} data.paymentMethod
 * @param {string} data.orderDate - ISO string or formatted
 */
export function generateCustomerInvoice(data) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftMargin = 20;
  const rightMargin = pageWidth - 20;
  
  // Colors
  const primaryColor = [41, 128, 185];
  const lightGray = [240, 240, 240];
  const darkGray = [100, 100, 100];
  const textColor = [60, 60, 60];
  
  let y = 25;

  // Header with background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  // Store logo and name in header
  if (data.storeLogo) {
    try {
      const logoSize = 15;
      const logoX = leftMargin;
      const logoY = 15;
      doc.addImage(data.storeLogo, "PNG", logoX, logoY, logoSize, logoSize);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18).setFont("helvetica", "bold");
      doc.text(data.storeName || "E-Store", logoX + logoSize + 10, logoY + 10);
    } catch (e) {
      // Fallback if logo fails to load
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18).setFont("helvetica", "bold");
      doc.text(data.storeName || "E-Store", leftMargin, 25);
    }
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18).setFont("helvetica", "bold");
    doc.text(data.storeName || "E-Store", leftMargin, 25);
  }
  
  // Invoice label in header
  doc.setFontSize(24).setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth / 2, 25, { align: "center" });
  
  y = 70;

  // Invoice details section with subtle background
  doc.setFillColor(...lightGray);
  doc.rect(leftMargin, y - 10, pageWidth - 40, 40, 'F');
  
  doc.setTextColor(...textColor);
  doc.setFontSize(11).setFont("helvetica", "bold");
  doc.text("INVOICE DETAILS", leftMargin, y);
  doc.setFont("helvetica", "normal");
  
  y += 7;
  doc.setFontSize(10);
  doc.text(`Invoice #: ${data.invoiceNumber}`, leftMargin, y);
  doc.text(`Order ID: ${data.orderId}`, leftMargin, y + 6);
  doc.text(`Date: ${formatDate(data.orderDate)}`, leftMargin, y + 12);
  
  // Customer details
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", pageWidth / 2, y);
  doc.setFont("helvetica", "normal");
  
  doc.text(data.customerName || '-', pageWidth / 2, y + 6);
  doc.text(data.customerEmail || '-', pageWidth / 2, y + 12);
  
  y += 25;

  // Products table with header
  doc.setFillColor(...primaryColor);
  doc.rect(leftMargin, y - 5, pageWidth - 40, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10).setFont("helvetica", "bold");
  doc.text("PRODUCT", leftMargin + 2, y);
  doc.text("QUANTITY", rightMargin - 45, y, { align: "right" });
  doc.text("PRICE", rightMargin, y, { align: "right" });
  
  y += 8;
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");
  
  // Product rows with alternating background
  data.products.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(leftMargin, y - 4, pageWidth - 40, 8, 'F');
    }
    
    doc.text(item.name, leftMargin + 2, y);
    doc.text(String(item.quantity), rightMargin - 45, y, { align: "right" });
    doc.text(`₹${item.price.toFixed(2)}`, rightMargin, y, { align: "right" });
    y += 8;
  });
  
  y += 10;

  // Totals section
  const totalsStartY = y;
  doc.setDrawColor(200, 200, 200);
  doc.line(leftMargin, y, rightMargin, y);
  y += 8;
  
  doc.setFontSize(11);
  doc.text("Subtotal:", rightMargin - 60, y, { align: "right" });
  doc.text(`₹${data.subtotal.toFixed(2)}`, rightMargin, y, { align: "right" });
  y += 8;
  
  // Calculate discount
  const discount = (data.subtotal - data.total).toFixed(2);
  if (parseFloat(discount) > 0) {
    doc.text("Discount:", rightMargin - 60, y, { align: "right" });
    doc.text(`-₹${discount}`, rightMargin, y, { align: "right" });
    y += 8;
  }
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL PAID:", rightMargin - 60, y, { align: "right" });
  doc.text(`₹${data.total.toFixed(2)}`, rightMargin, y, { align: "right" });
  
  // Payment method
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Payment Method: ${data.paymentMethod || '-'}`, leftMargin, totalsStartY + 8);
  
  y += 20;

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(...darkGray);
  doc.text("Thank you for your business!", pageWidth / 2, y, { align: "center" });
  y += 4;
  doc.text("For any inquiries, please contact our customer support.", pageWidth / 2, y, { align: "center" });
  
  // Bottom border
  doc.setDrawColor(200, 200, 200);
  doc.line(leftMargin, doc.internal.pageSize.getHeight() - 20, rightMargin, doc.internal.pageSize.getHeight() - 20);
  
  // Footer text
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

  // Save PDF
  doc.save(`Invoice_${data.invoiceNumber}.pdf`);
}

/**
 * Format date for invoice display
 * @param {string|Date} date
 * @returns {string}
 */
function formatDate(date) {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", { 
    year: "numeric", 
    month: "short", 
    day: "numeric" 
  });
}