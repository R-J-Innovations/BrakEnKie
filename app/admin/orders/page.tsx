"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

async function resendInvoice(orderId: string): Promise<void> {
  const res = await fetch("/api/admin/resend-invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || "Failed to resend");
  }
}

type OrderItem = {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  size: string | null;
};

type Order = {
  id: string;
  // legacy single-product fields (may be null for cart orders)
  product_name: string | null;
  product_price: number | null;
  quantity: number | null;
  total_amount: number;
  buyer_first_name: string;
  buyer_last_name: string;
  buyer_email: string | null;
  buyer_phone: string | null;
  status: "pending" | "paid" | "cancelled" | "failed";
  payfast_payment_id: string | null;
  size: string | null;
  delivery_address: string | null;
  delivery_fee: number;
  created_at: string;
  order_items: OrderItem[];
};

const statusStyles: Record<string, string> = {
  paid: "bg-green-500 text-white",
  pending: "bg-yellow-400 text-black",
  cancelled: "bg-stone-400 text-white",
  failed: "bg-red-500 text-white",
};

export default function AdminOrders() {
  const [session, setSession] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<{ id: string; ok: boolean } | null>(null);
  const router = useRouter();

  async function handleResend(orderId: string) {
    setResending(orderId);
    setResendMsg(null);
    try {
      await resendInvoice(orderId);
      setResendMsg({ id: orderId, ok: true });
    } catch {
      setResendMsg({ id: orderId, ok: false });
    } finally {
      setResending(null);
    }
  }

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setSession(session);

      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
      setLoading(false);
    }
    init();
  }, [router]);

  if (!session) return null;

  const totalRevenue = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + (o.total_amount ?? 0), 0);

  return (
    <div className="min-h-screen p-10">
      <div className="flex items-center gap-4 mb-2">
        <a href="/admin" className="text-sm opacity-50 hover:opacity-100 transition-opacity">
          ← Dashboard
        </a>
        <h1 className="text-3xl font-serif">Orders</h1>
      </div>
      <p className="text-sm opacity-40 mb-10">
        {orders.filter((o) => o.status === "paid").length} paid &middot;{" "}
        R {totalRevenue.toFixed(2)} total revenue
      </p>

      {loading ? (
        <p className="opacity-40 animate-pulse text-sm">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="opacity-40 text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-3 max-w-4xl">
          {orders.map((order) => {
            // Cart orders use order_items; legacy orders use the flat fields
            const isCartOrder = order.order_items && order.order_items.length > 0;

            return (
              <div
                key={order.id}
                className="p-5 bg-[var(--card)] rounded-xl shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    {isCartOrder ? (
                      <h3 className="font-serif text-lg">
                        {order.order_items.length === 1
                          ? order.order_items[0].product_name
                          : `${order.order_items.length} items`}
                      </h3>
                    ) : (
                      <h3 className="font-serif text-lg">{order.product_name ?? "—"}</h3>
                    )}
                    <p className="text-xs opacity-40 font-sans mt-1">
                      BK-{order.id.substring(0, 8).toUpperCase()} &middot;{" "}
                      {new Date(order.created_at).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-lg font-serif text-[var(--accent)]">
                      R {(order.total_amount ?? 0).toFixed(2)}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-sans tracking-widest uppercase ${statusStyles[order.status] || "bg-stone-300"}`}
                    >
                      {order.status}
                    </span>
                    <button
                      onClick={() => handleResend(order.id)}
                      disabled={resending === order.id}
                      title="Resend invoice email"
                      className="text-[10px] tracking-[0.15em] uppercase font-sans opacity-40 hover:opacity-90 transition-opacity disabled:opacity-20"
                    >
                      {resending === order.id
                        ? "Sending…"
                        : resendMsg?.id === order.id
                        ? resendMsg.ok ? "Sent ✓" : "Failed ✗"
                        : "Resend"}
                    </button>
                  </div>
                </div>

                {/* Items breakdown */}
                {isCartOrder ? (
                  <div className="mb-3 space-y-1">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm font-sans">
                        <span>
                          {item.product_name}
                          {item.size && <span className="opacity-40 ml-1">({item.size})</span>}
                          <span className="opacity-40 ml-1">× {item.quantity}</span>
                        </span>
                        <span className="opacity-60">R {(item.product_price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                  <div>
                    <span className="opacity-40">Buyer: </span>
                    {order.buyer_first_name} {order.buyer_last_name}
                  </div>
                  {order.buyer_email && (
                    <div>
                      <span className="opacity-40">Email: </span>
                      <a
                        href={`mailto:${order.buyer_email}`}
                        className="hover:text-[var(--accent)] transition-colors"
                      >
                        {order.buyer_email}
                      </a>
                    </div>
                  )}
                  {order.buyer_phone && (
                    <div>
                      <span className="opacity-40">Phone: </span>
                      {order.buyer_phone}
                    </div>
                  )}
                  {/* Legacy single-product qty line */}
                  {!isCartOrder && order.product_price != null && (
                    <div>
                      <span className="opacity-40">Qty: </span>
                      {order.quantity} &times; R {order.product_price.toFixed(2)}
                    </div>
                  )}
                  {!isCartOrder && order.size && (
                    <div>
                      <span className="opacity-40">Size: </span>
                      {order.size}
                    </div>
                  )}
                  {order.delivery_address && (
                    <div className="sm:col-span-2">
                      <span className="opacity-40">Deliver to: </span>
                      {order.delivery_address}
                    </div>
                  )}
                  {order.delivery_fee > 0 && (
                    <div>
                      <span className="opacity-40">Delivery fee: </span>
                      R {(order.delivery_fee ?? 0).toFixed(2)}
                    </div>
                  )}
                  {order.payfast_payment_id && (
                    <div>
                      <span className="opacity-40">PayFast ID: </span>
                      <span className="font-mono text-xs">{order.payfast_payment_id}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
