"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
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
  const router = useRouter();

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
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
      setLoading(false);
    }
    init();
  }, [router]);

  if (!session) return null;

  const totalRevenue = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.total_amount, 0);

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
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 bg-[var(--card)] rounded-xl shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-serif text-lg">{order.product_name}</h3>
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
                    R {order.total_amount.toFixed(2)}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-sans tracking-widest uppercase ${statusStyles[order.status] || "bg-stone-300"}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

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
                <div>
                  <span className="opacity-40">Qty: </span>
                  {order.quantity} &times; R {order.product_price.toFixed(2)}
                </div>
                {order.size && (
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
                    R {order.delivery_fee.toFixed(2)}
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
          ))}
        </div>
      )}
    </div>
  );
}
