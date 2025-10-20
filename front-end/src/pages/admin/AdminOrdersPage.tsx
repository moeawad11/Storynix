import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { Book, Order } from "../../types/index.js";

export type AdminBookPayload = Omit<Book, "id">;
export interface AdminOrder extends Order {
  customerName: string;
  shippingAddress: string;
  paymentMethod: string;
}

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus: OrderStatus) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status", err);
      alert("Failed to update order status");
    }
  };

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === filter);

  if (loading)
    return (
      <div className="text-center py-10 text-gray-600">Loading orders...</div>
    );

  if (orders.length === 0)
    return (
      <div className="text-center text-gray-500 mt-10">No orders found.</div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Orders</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="All">All</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 font-medium text-gray-700">#{order.id}</td>
                <td className="p-3">{order.customerName}</td>
                <td className="p-3">${Number(order.totalPrice).toFixed(2)}</td>
                <td className="p-3">{order.orderStatus}</td>
                <td className="p-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 text-center">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value as OrderStatus
                      )
                    }
                    className="border rounded-lg px-2 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
