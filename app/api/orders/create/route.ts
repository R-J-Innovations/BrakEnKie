import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { buildPayFastPayment } from "@/lib/payfast";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      buyerFirstName,
      buyerLastName,
      buyerEmail,
      buyerPhone,
      quantity = 1,
      size,
      deliveryAddress,
      deliveryFee = 0,
    } = body;

    if (!productId || !buyerFirstName || !buyerLastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!deliveryAddress) {
      return NextResponse.json(
        { error: "Delivery address is required" },
        { status: 400 }
      );
    }

    // Fetch product with numeric price
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id, name, price, is_active")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product.is_active) {
      return NextResponse.json(
        { error: "Product is not available" },
        { status: 400 }
      );
    }

    if (!product.price) {
      return NextResponse.json(
        { error: "Product price not set" },
        { status: 400 }
      );
    }

    const productTotal = parseFloat(product.price) * quantity;
    const totalAmount = productTotal + parseFloat(deliveryFee);
    const orderId = uuidv4();

    // Create pending order
    const { error: orderError } = await supabaseAdmin.from("orders").insert({
      id: orderId,
      product_id: productId,
      product_name: product.name,
      product_price: parseFloat(product.price),
      quantity,
      total_amount: totalAmount,
      buyer_first_name: buyerFirstName,
      buyer_last_name: buyerLastName,
      buyer_email: buyerEmail || null,
      buyer_phone: buyerPhone || null,
      size: size || null,
      delivery_address: deliveryAddress,
      delivery_fee: parseFloat(deliveryFee),
      status: "pending",
    });

    if (orderError) {
      console.error("Order insert error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Build PayFast payment fields
    const payment = buildPayFastPayment({
      orderId,
      productName: product.name,
      amount: totalAmount,
      buyerFirstName,
      buyerLastName,
      buyerEmail: buyerEmail || `guest-${orderId.substring(0, 8)}@brakenkie.co.za`,
      buyerPhone,
    });

    return NextResponse.json({ ...payment, orderId });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
