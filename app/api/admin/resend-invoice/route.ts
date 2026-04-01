import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerClient } from "@supabase/ssr";
import { sendOrderEmails } from "@/lib/email";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  // Auth check — must be a logged-in admin
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await req.json();
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const items =
    order.order_items && order.order_items.length > 0
      ? order.order_items.map((i: any) => ({
          productName: i.product_name,
          productPrice: i.product_price,
          quantity: i.quantity,
          size: i.size ?? undefined,
        }))
      : order.product_name
      ? [{ productName: order.product_name, productPrice: order.product_price, quantity: order.quantity, size: order.size ?? undefined }]
      : [];

  await sendOrderEmails({
    orderId: order.id,
    orderDate: order.created_at,
    items,
    totalAmount: order.total_amount,
    buyerFirstName: order.buyer_first_name,
    buyerLastName: order.buyer_last_name,
    buyerEmail: order.buyer_email,
    buyerPhone: order.buyer_phone,
    paymentId: order.payfast_payment_id ?? undefined,
    deliveryAddress: order.delivery_address ?? undefined,
    deliveryFee: order.delivery_fee ?? 0,
  });

  return NextResponse.json({ ok: true });
}
