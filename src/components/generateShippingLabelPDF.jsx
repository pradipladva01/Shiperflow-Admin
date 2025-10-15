import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
// import { generateBarcodeDataUrl } from "../utils/barcodeUtils";

const normalizeOrder = (order) => ({
  id: order.id || "ORD000000000",
  shopifyId: order.shopifyId || "#0000",
  date: order.date || "2024-01-01",
  customerName: order.customer || "Unknown Customer",
  address: "123 Placeholder Street",
  cityStateZip: "Some City, Some State, 000000",
  phone: "9999999999",
  paymentMode: order.paymentMode || "Prepaid",
  total:
    order.amount && typeof order.amount === "string"
      ? order.amount.replace(/[^\d]/g, "")
      : "0",
  fwdCode: `DEL/DEF/CN${order.awbNumber || "0000000000"}`,
  category: "General Goods",
  awb: order.awbNumber || "0000000000",
  products: [
    {
      sku: order?.sku || "N/A",
      name: order.product || "Generic Product",
      qty: 1,
      amount:
        order.amount && typeof order.amount === "string"
          ? order.amount.replace(/[^\d]/g, "")
          : "0",
    },
  ],
});

export const generateShippingLabelPDF = async (orders) => {
  const pdfDoc = await PDFDocument.create();

  // ✅ Use built-in Helvetica font (no fontkit needed)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const raw of orders) {
    const order = normalizeOrder(raw);

    // const [orderBarcodeUrl, awbBarcodeUrl] = await Promise.all([
    //   generateBarcodeDataUrl(order.id),
    //   generateBarcodeDataUrl(order.awb),
    // ]);

    // const orderBarcodeImage = await pdfDoc.embedPng(orderBarcodeUrl);
    // const awbBarcodeImage = await pdfDoc.embedPng(awbBarcodeUrl);

    const page = pdfDoc.addPage([288, 432]);
    const { width, height } = page.getSize();
    let y = height - 20;

    const drawText = (text, x, y, size = 10) => {
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0),
      });
    };

    // TOP
    drawText(order.fwdCode, 20, y);
    drawText(order.date, 200, y);
    y -= 14;
    drawText(order.customerName, 20, y);
    y -= 12;
    drawText(order.address, 20, y);
    y -= 12;
    drawText(order.cityStateZip, 20, y);
    y -= 12;
    drawText(`MOBILE NO: ${order.phone}`, 20, y);

    // Divider
    y -= 12;
    page.drawLine({
      start: { x: 20, y },
      end: { x: width - 20, y },
      thickness: 1,
    });

    // Payment
    y -= 24;
    drawText(order.paymentMode, 30, y);
    drawText("SD", width - 60, y);
    drawText(order.total, 30, y - 12);

    // Order Info
    y -= 28;
    page.drawLine({
      start: { x: 20, y },
      end: { x: width - 20, y },
      thickness: 1,
    });
    y -= 14;
    drawText("Order No:", 20, y);
    drawText(`#${order.id}`, 80, y);
    drawText(`#${order.id}`, width - 100, y);

    // page.drawImage(orderBarcodeImage, {
    //   x: width - 95,
    //   y: y - 35,
    //   width: 70,
    //   height: 30,
    // });

    y -= 12;
    drawText("Order Date:", 20, y);
    drawText(order.date, 80, y);

    // --- DRAW DESTINATION & CATEGORY ---
    y -= 40;
    page.drawLine({
      start: { x: 20, y },
      end: { x: width - 20, y },
      thickness: 1,
    });
    y -= 14;
    drawText(`Fwd Destination Code: ${order.fwdCode}`, 20, y);
    y -= 12;
    drawText(`Category: ${order.category}`, 20, y);

    // ✅ AWB barcode centered
    // page.drawImage(awbBarcodeImage, {
    //   x: (width - 180) / 2,
    //   y: y - 50,
    //   width: 180,
    //   height: 40,
    // });

    // --- PRODUCT TABLE ---
    y -= 64;
    page.drawLine({
      start: { x: 20, y },
      end: { x: width - 20, y },
      thickness: 1,
    });
    y -= 12;
    drawText("Product Details:", 20, y);

    const colWidths = [30, 168, 20, 30];
    const tableData = [
      ["SKU", "Item Name", "Qty", "Amount"],
      ...order.products.map((p) => [p.sku, p.name, String(p.qty), p.amount]),
      ["", "Order Total", "", order.total],
    ];

    y -= 22;
    tableData.forEach((row) => {
      let x = 20;
      row.forEach((cell, i) => {
        page.drawRectangle({
          x,
          y,
          width: colWidths[i],
          height: 16,
          borderWidth: 1,
          borderColor: rgb(0, 0, 0),
        });
        drawText(cell, x + 2, y + 4, 8);
        x += colWidths[i];
      });
      y -= 16;
    });

    // Footer
    y -= 16;
    drawText("For any query please", 20, y);
    y -= 12;
    drawText("contact: Email: Sales@Sadho.in", 20, y);
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  saveAs(blob, "bulk-shipping-labels.pdf");
};
