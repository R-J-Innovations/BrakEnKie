import { Resend } from "resend";
import { generateInvoiceHtml, InvoiceData } from "./invoice";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || "BrakEnKie Orders <orders@brakenkie.co.za>";
const STORE_EMAIL = "info@brakenkie.co.za";

/**
 * Sends the invoice/notification to info@brakenkie.co.za
 * and optionally directly to the buyer if they provided their email.
 */
export async function sendOrderEmails(data: InvoiceData): Promise<void> {
  const invoiceHtml = generateInvoiceHtml(data);
  const invoiceNumber = `BK-${data.orderId.substring(0, 8).toUpperCase()}`;
  const subject = `Order Confirmed — ${data.productName} (${invoiceNumber})`;

  // Always send to the store
  await resend.emails.send({
    from: FROM_EMAIL,
    to: STORE_EMAIL,
    subject: `[New Order] ${subject}`,
    html: invoiceHtml,
  });

  // If buyer provided their email, send them a copy too
  if (data.buyerEmail && data.buyerEmail.trim()) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.buyerEmail.trim(),
      subject: `Your BrakEnKie Order — ${invoiceNumber}`,
      html: invoiceHtml,
    });
  }
}
