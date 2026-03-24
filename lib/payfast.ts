import crypto from "crypto";

export type PayFastFields = Record<string, string>;

/**
 * Builds the PayFast parameter string and generates an MD5 signature.
 * Field order matters — pass data in the order PayFast expects it.
 */
export function generateSignature(data: PayFastFields, passphrase?: string): string {
  const parts = Object.entries(data)
    .filter(([, v]) => v !== "" && v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`);

  let paramString = parts.join("&");
  if (passphrase) {
    paramString += `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`;
  }

  return crypto.createHash("md5").update(paramString).digest("hex");
}

export interface PayFastPaymentInput {
  orderId: string;
  productName: string;
  amount: number; // in Rands, e.g. 350.00
  buyerFirstName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone?: string;
}

export function buildPayFastPayment(input: PayFastPaymentInput): {
  url: string;
  fields: PayFastFields;
} {
  const isSandbox = process.env.PAYFAST_SANDBOX === "true";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  // Field order must match PayFast's expected order for signature
  const data: PayFastFields = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID!,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY!,
    return_url: `${siteUrl}/shop/success?order_id=${input.orderId}`,
    cancel_url: `${siteUrl}/shop/cancelled?order_id=${input.orderId}`,
    notify_url: `${siteUrl}/api/payfast/notify`,
    name_first: input.buyerFirstName,
    name_last: input.buyerLastName,
    email_address: input.buyerEmail,
    ...(input.buyerPhone ? { cell_number: input.buyerPhone } : {}),
    m_payment_id: input.orderId,
    amount: input.amount.toFixed(2),
    item_name: input.productName.substring(0, 100),
  };

  const signature = generateSignature(data, process.env.PAYFAST_PASSPHRASE);

  return {
    url: isSandbox
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process",
    fields: { ...data, signature },
  };
}
