export interface OrderLineItem {
  productName: string;
  productPrice: number;
  quantity: number;
  size?: string;
}

export interface InvoiceData {
  orderId: string;
  orderDate: string;
  items: OrderLineItem[];
  totalAmount: number;
  buyerFirstName: string;
  buyerLastName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  paymentId?: string;
  deliveryAddress?: string;
  deliveryFee?: number;
}

export function generateInvoiceHtml(data: InvoiceData): string {
  const invoiceNumber = `BK-${data.orderId.substring(0, 8).toUpperCase()}`;
  const formattedDate = new Date(data.orderDate).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const itemsSubtotal = data.items.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );
  const deliveryFee = data.deliveryFee ?? 0;

  const lineItemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:16px 0;color:#1a1a1a;font-size:14px;font-family:'Georgia',serif;border-bottom:1px solid #f0ebe3;">
        ${item.productName}
        ${item.size ? `<span style="display:block;color:#888;font-size:11px;font-family:Arial,sans-serif;margin-top:3px;">Size: ${item.size}</span>` : ""}
      </td>
      <td align="center" style="padding:16px 0;color:#666;font-size:14px;font-family:Arial,sans-serif;border-bottom:1px solid #f0ebe3;">
        ${item.quantity}
      </td>
      <td align="right" style="padding:16px 0;color:#666;font-size:14px;font-family:Arial,sans-serif;border-bottom:1px solid #f0ebe3;">
        R ${item.productPrice.toFixed(2)}
      </td>
      <td align="right" style="padding:16px 0;color:#1a1a1a;font-size:14px;font-family:Arial,sans-serif;border-bottom:1px solid #f0ebe3;">
        R ${(item.productPrice * item.quantity).toFixed(2)}
      </td>
    </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice ${invoiceNumber}</title>
</head>
<body style="margin:0;padding:0;background:#f5f0ea;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ea;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a;padding:40px 48px;">
              <h1 style="margin:0;color:#c9a96e;font-family:'Georgia',serif;font-size:28px;font-weight:300;letter-spacing:0.1em;">
                BrakEnKie
              </h1>
              <p style="margin:4px 0 0;color:#ffffff;opacity:0.5;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;font-family:Arial,sans-serif;">
                French Bulldogs
              </p>
            </td>
          </tr>

          <!-- Invoice Title -->
          <tr>
            <td style="padding:40px 48px 0;border-bottom:1px solid #e8e0d4;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h2 style="margin:0 0 4px;color:#1a1a1a;font-size:22px;font-weight:400;font-family:'Georgia',serif;">
                      Invoice
                    </h2>
                    <p style="margin:0;color:#888;font-size:12px;font-family:Arial,sans-serif;letter-spacing:0.1em;">
                      ${invoiceNumber}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;color:#888;font-size:12px;font-family:Arial,sans-serif;">
                      ${formattedDate}
                    </p>
                    ${data.paymentId ? `
                    <p style="margin:4px 0 0;color:#888;font-size:11px;font-family:Arial,sans-serif;">
                      Payment: ${data.paymentId}
                    </p>
                    ` : ""}
                  </td>
                </tr>
              </table>
              <div style="height:32px;"></div>
            </td>
          </tr>

          <!-- Buyer & Seller Info -->
          <tr>
            <td style="padding:32px 48px;border-bottom:1px solid #e8e0d4;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="vertical-align:top;">
                    <p style="margin:0 0 8px;color:#888;font-size:10px;font-family:Arial,sans-serif;letter-spacing:0.3em;text-transform:uppercase;">
                      From
                    </p>
                    <p style="margin:0;color:#1a1a1a;font-size:14px;font-family:'Georgia',serif;">BrakEnKie</p>
                    <p style="margin:2px 0 0;color:#666;font-size:12px;font-family:Arial,sans-serif;">info@brakenkie.co.za</p>
                    <p style="margin:2px 0 0;color:#666;font-size:12px;font-family:Arial,sans-serif;">+27 71 898 1890</p>
                  </td>
                  <td width="50%" style="vertical-align:top;">
                    <p style="margin:0 0 8px;color:#888;font-size:10px;font-family:Arial,sans-serif;letter-spacing:0.3em;text-transform:uppercase;">
                      Bill To
                    </p>
                    <p style="margin:0;color:#1a1a1a;font-size:14px;font-family:'Georgia',serif;">
                      ${data.buyerFirstName} ${data.buyerLastName}
                    </p>
                    ${data.buyerEmail ? `<p style="margin:2px 0 0;color:#666;font-size:12px;font-family:Arial,sans-serif;">${data.buyerEmail}</p>` : ""}
                    ${data.buyerPhone ? `<p style="margin:2px 0 0;color:#666;font-size:12px;font-family:Arial,sans-serif;">${data.buyerPhone}</p>` : ""}
                    ${data.deliveryAddress ? `<p style="margin:6px 0 0;color:#666;font-size:12px;font-family:Arial,sans-serif;line-height:1.5;">${data.deliveryAddress}</p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Line Items -->
          <tr>
            <td style="padding:32px 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr style="border-bottom:1px solid #e8e0d4;">
                  <td style="padding-bottom:12px;color:#888;font-size:10px;font-family:Arial,sans-serif;letter-spacing:0.3em;text-transform:uppercase;">
                    Item
                  </td>
                  <td align="center" style="padding-bottom:12px;color:#888;font-size:10px;font-family:Arial,sans-serif;letter-spacing:0.3em;text-transform:uppercase;">
                    Qty
                  </td>
                  <td align="right" style="padding-bottom:12px;color:#888;font-size:10px;font-family:Arial,sans-serif;letter-spacing:0.3em;text-transform:uppercase;">
                    Price
                  </td>
                  <td align="right" style="padding-bottom:12px;color:#888;font-size:10px;font-family:Arial,sans-serif;letter-spacing:0.3em;text-transform:uppercase;">
                    Total
                  </td>
                </tr>
                ${lineItemsHtml}
                ${deliveryFee > 0 ? `
                <tr>
                  <td colspan="3" style="padding:12px 0;color:#666;font-size:13px;font-family:Arial,sans-serif;border-bottom:1px solid #f0ebe3;">
                    Courier Guy Delivery
                  </td>
                  <td align="right" style="padding:12px 0;color:#1a1a1a;font-size:13px;font-family:Arial,sans-serif;border-bottom:1px solid #f0ebe3;">
                    R ${deliveryFee.toFixed(2)}
                  </td>
                </tr>
                ` : ""}
              </table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                <tr>
                  <td></td>
                  <td width="200" align="right">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;color:#888;font-size:12px;font-family:Arial,sans-serif;">Subtotal</td>
                        <td align="right" style="padding:8px 0;color:#1a1a1a;font-size:12px;font-family:Arial,sans-serif;">
                          R ${itemsSubtotal.toFixed(2)}
                        </td>
                      </tr>
                      ${deliveryFee > 0 ? `
                      <tr>
                        <td style="padding:8px 0;color:#888;font-size:12px;font-family:Arial,sans-serif;">Delivery</td>
                        <td align="right" style="padding:8px 0;color:#1a1a1a;font-size:12px;font-family:Arial,sans-serif;">
                          R ${deliveryFee.toFixed(2)}
                        </td>
                      </tr>
                      ` : ""}
                      <tr>
                        <td colspan="2" style="border-top:2px solid #1a1a1a;padding-top:12px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color:#1a1a1a;font-size:16px;font-family:'Georgia',serif;font-weight:400;">
                                Total Paid
                              </td>
                              <td align="right" style="color:#c9a96e;font-size:18px;font-family:'Georgia',serif;font-weight:400;">
                                R ${data.totalAmount.toFixed(2)}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status Badge -->
          <tr>
            <td style="padding:0 48px 32px;">
              <span style="display:inline-block;background:#d4edda;color:#155724;font-size:11px;font-family:Arial,sans-serif;letter-spacing:0.2em;text-transform:uppercase;padding:6px 14px;border-radius:4px;">
                Payment Confirmed
              </span>
            </td>
          </tr>

          <!-- Delivery Note -->
          <tr>
            <td style="padding:0 48px 24px;">
              <div style="background:#f8f5f0;border-left:3px solid #c9a96e;padding:14px 16px;">
                <p style="margin:0;color:#555;font-size:12px;font-family:Arial,sans-serif;line-height:1.6;">
                  <strong style="color:#1a1a1a;">Delivery:</strong> 5–10 working days via The Courier Guy. All orders are made to order — please allow time for production before dispatch.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f5f0;padding:32px 48px;border-top:1px solid #e8e0d4;">
              <p style="margin:0;color:#888;font-size:11px;font-family:Arial,sans-serif;line-height:1.6;text-align:center;">
                Thank you for your purchase from BrakEnKie.<br/>
                For any queries, please contact us at
                <a href="mailto:info@brakenkie.co.za" style="color:#c9a96e;text-decoration:none;">info@brakenkie.co.za</a>
                or WhatsApp <a href="https://wa.me/27718981890" style="color:#c9a96e;text-decoration:none;">+27 71 898 1890</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
