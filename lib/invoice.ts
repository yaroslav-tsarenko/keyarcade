import PDFDocument from "pdfkit";
import { COMPANY, SITE, formatMoney, type CurrencyCode } from "@/lib/site-config";

export interface InvoiceData {
  orderId: string;
  date: string;
  customerEmail: string;
  customerName?: string;
  currency: CurrencyCode;
  items: { name: string; qty: number; priceEur: number }[];
  promo?: { code: string; amountEur: number };
}

// Builds a PDF invoice buffer. Prices are stored in EUR and rendered in the
// order's currency.
export function buildInvoice(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const money = (eur: number) => formatMoney(eur, data.currency);

    // Header
    doc.fillColor("#191207").fontSize(24).text("KEYARCADE", { continued: false });
    doc.fontSize(10).fillColor("#3a2f1e").text(SITE.url);
    doc.moveDown();

    // Seller / Merchant of Record
    doc.fontSize(9).fillColor("#3a2f1e");
    doc.text(COMPANY.legalName);
    doc.text(`Registration number: ${COMPANY.regNumber}`);
    doc.text(COMPANY.address);
    doc.text(`Merchant of Record: ${COMPANY.merchantOfRecord}`);
    doc.moveDown();

    // Invoice meta
    doc.fontSize(16).fillColor("#191207").text(`Invoice ${data.orderId}`);
    doc.fontSize(9).fillColor("#3a2f1e");
    doc.text(`Date: ${data.date}`);
    doc.text(`Billed to: ${data.customerName ?? data.customerEmail}`);
    doc.text(data.customerEmail);
    doc.moveDown();

    // Table header
    const top = doc.y;
    doc.fontSize(10).fillColor("#191207");
    doc.text("Item", 50, top);
    doc.text("Qty", 330, top);
    doc.text("Price", 390, top);
    doc.text("Total", 470, top);
    doc.moveTo(50, doc.y + 4).lineTo(545, doc.y + 4).strokeColor("#e0cba3").stroke();
    doc.moveDown();

    let subtotal = 0;
    for (const it of data.items) {
      const y = doc.y;
      const lineTotal = it.priceEur * it.qty;
      subtotal += lineTotal;
      doc.fillColor("#191207").fontSize(10);
      doc.text(it.name, 50, y, { width: 270 });
      doc.text(String(it.qty), 330, y);
      doc.text(money(it.priceEur), 390, y);
      doc.text(money(lineTotal), 470, y);
      doc.moveDown(0.5);
    }

    doc.moveTo(50, doc.y + 4).lineTo(545, doc.y + 4).strokeColor("#e0cba3").stroke();
    doc.moveDown();
    if (data.promo) {
      doc.fontSize(10).fillColor("#3a2f1e").text(`Subtotal: ${money(subtotal)}`, { align: "right" });
      doc.text(`Promo ${data.promo.code}: −${money(data.promo.amountEur)}`, { align: "right" });
    }
    doc
      .fontSize(12)
      .fillColor("#191207")
      .text(`Total: ${money(subtotal - (data.promo?.amountEur ?? 0))}`, { align: "right" });
    doc.moveDown(2);

    doc
      .fontSize(8)
      .fillColor("#3a2f1e")
      .text(
        `Digital goods (software activation keys). ${COMPANY.legalName} is not registered for VAT, ` +
          "so no VAT is charged and none is shown separately. Delivery began immediately at your " +
          "express request, which ends the 14-day right of withdrawal once the key is issued. " +
          `This charge appears on your statement as ${COMPANY.billingDescriptor}. ` +
          `Invoice issued by ${COMPANY.legalName}. Support: ${COMPANY.email} · ${COMPANY.phone}.`,
        { align: "left" },
      );

    doc.end();
  });
}
