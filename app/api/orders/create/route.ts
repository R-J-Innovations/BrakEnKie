import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { buildPayFastPayment } from "@/lib/payfast";
import { v4 as uuidv4 } from "uuid";

const DELIVERY_FEE = 99;

interface CartItemInput {
  productId: string;
  quantity: number;
  size?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      buyerFirstName,
      buyerLastName,
      buyerEmail,
      buyerPhone,
      deliveryAddress,
    }: {
      items: CartItemInput[];
      buyerFirstName: string;
      buyerLastName: string;
      buyerEmail?: string;
      buyerPhone?: string;
      deliveryAddress: string;
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!buyerFirstName || !buyerLastName || !buyerEmail) {
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

    // Fetch all products in one query
    const productIds = items.map((i) => i.productId);
    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, name, price, is_active")
      .in("id", productIds);

    if (productsError || !products) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    // Validate each item
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        );
      }
      if (!product.is_active) {
        return NextResponse.json(
          { error: `Product is not available: ${product.name}` },
          { status: 400 }
        );
      }
      if (!product.price) {
        return NextResponse.json(
          { error: `Product price not set: ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const itemsSubtotal = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + parseFloat(product.price) * item.quantity;
    }, 0);
    const totalAmount = itemsSubtotal + DELIVERY_FEE;
    const orderId = uuidv4();

    // Create the order (no single product_id — items live in order_items)
    const { error: orderError } = await supabaseAdmin.from("orders").insert({
      id: orderId,
      total_amount: totalAmount,
      buyer_first_name: buyerFirstName,
      buyer_last_name: buyerLastName,
      buyer_email: buyerEmail || null,
      buyer_phone: buyerPhone || null,
      delivery_address: deliveryAddress,
      delivery_fee: DELIVERY_FEE,
      status: "pending",
    });

    if (orderError) {
      console.error("Order insert error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Insert order_items rows
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        order_id: orderId,
        product_id: item.productId,
        product_name: product.name,
        product_price: parseFloat(product.price),
        quantity: item.quantity,
        size: item.size || null,
      };
    });

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items insert error:", itemsError);
      // Roll back the order
      await supabaseAdmin.from("orders").delete().eq("id", orderId);
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      );
    }

    // Build PayFast payment fields
    const firstProduct = products.find((p) => p.id === items[0].productId)!;
    const itemName =
      items.length === 1
        ? firstProduct.name
        : `${firstProduct.name} + ${items.length - 1} more`;

    const payment = buildPayFastPayment({
      orderId,
      productName: itemName,
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
