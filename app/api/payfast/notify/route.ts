import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateSignature } from "@/lib/payfast";
import { sendOrderEmails } from "@/lib/email";

// PayFast valid IP ranges for ITN
const PAYFAST_IPS = [
  // Legacy on-premises range (kept during transition)
  "197.97.145.144",
  "197.97.145.145",
  "197.97.145.146",
  "197.97.145.147",
  "197.97.145.148",
  "197.97.145.149",
  "197.97.145.150",
  "197.97.145.151",
  "197.97.145.152",
  "197.97.145.153",
  "197.97.145.154",
  "197.97.145.155",
  "197.97.145.156",
  "197.97.145.157",
  "197.97.145.158",
  "197.97.145.159",
  // Legacy sandbox
  "197.97.145.208",
  // New AWS IPs (effective 31 July 2025)
  "3.163.236.237",
  "3.163.238.237",
  "3.163.251.237",
  "3.163.232.237",
  "3.163.241.237",
  "3.163.245.237",
  "3.163.248.237",
  "3.163.234.237",
  "3.163.237.237",
  "3.163.243.237",
  "3.163.247.237",
  "3.163.242.237",
  "3.163.244.237",
  "3.163.249.237",
  "3.163.252.237",
  "3.163.235.237",
  "3.163.239.237",
  "3.163.250.237",
  "3.163.233.237",
  "3.163.246.237",
  "3.163.240.237",
];

export async function POST(req: NextRequest) {
  try {
    // Extract real IP — check Cloudflare, Vercel, and standard headers
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";
    const isSandbox = process.env.PAYFAST_SANDBOX === "true";
    const ipAllowed = PAYFAST_IPS.includes(ip);
    console.log("PayFast ITN received | IP:", ip, "| allowed:", ipAllowed, "| sandbox:", isSandbox);
    if (!isSandbox && !ipAllowed) {
      console.warn("PayFast ITN BLOCKED — unrecognised IP:", ip);
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Parse body (PayFast sends application/x-www-form-urlencoded)
    const formData = await req.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    // Verify signature
    const receivedSignature = data.signature;
    const { signature: _sig, ...dataWithoutSig } = data;
    const expectedSignature = generateSignature(
      dataWithoutSig,
      process.env.PAYFAST_PASSPHRASE
    );

    const paymentStatus = data.payment_status;
    const orderId = data.m_payment_id;

    if (receivedSignature !== expectedSignature) {
      console.error("PayFast ITN BLOCKED — signature mismatch", { receivedSignature, expectedSignature });
      return new NextResponse("Invalid signature", { status: 400 });
    }
    console.log("PayFast ITN signature OK — orderId:", orderId, "status:", paymentStatus);
    const paymentId = data.pf_payment_id;

    if (!orderId) {
      return new NextResponse("Missing order ID", { status: 400 });
    }

    // Fetch the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("Order not found for ITN:", orderId);
      return new NextResponse("Order not found", { status: 404 });
    }

    // Verify amount matches (important anti-fraud check)
    const itnAmount = parseFloat(data.amount_gross || "0");
    if (Math.abs(itnAmount - order.total_amount) > 0.01) {
      console.error("PayFast ITN BLOCKED — amount mismatch", { itnAmount, expected: order.total_amount });
      return new NextResponse("Amount mismatch", { status: 400 });
    }

    if (paymentStatus === "COMPLETE") {
      // Update order to paid
      await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          payfast_payment_id: paymentId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      // Send invoice emails
      await sendOrderEmails({
        orderId: order.id,
        orderDate: order.created_at,
        productName: order.product_name,
        productPrice: order.product_price,
        quantity: order.quantity,
        totalAmount: order.total_amount,
        buyerFirstName: order.buyer_first_name,
        buyerLastName: order.buyer_last_name,
        buyerEmail: order.buyer_email,
        buyerPhone: order.buyer_phone,
        paymentId,
        size: order.size || undefined,
        deliveryAddress: order.delivery_address || undefined,
        deliveryFee: order.delivery_fee ?? 0,
      });
    } else if (paymentStatus === "CANCELLED") {
      await supabaseAdmin
        .from("orders")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("id", orderId);
    } else if (paymentStatus === "FAILED") {
      await supabaseAdmin
        .from("orders")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", orderId);
    }

    // PayFast expects a plain 200 OK with no body (or "OK")
    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("PayFast ITN error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
