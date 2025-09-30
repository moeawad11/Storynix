import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.js";
import api from "../api/axios.js";
import { User, Order } from "../types/index.js";

const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();

  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser) {
        setError("Authentication data is missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const profileResponse = await api.get("/users/profile");
        setUserDetails(profileResponse.data.user);

        const ordersResponse = await api.get("/orders/myorders");
        setOrders(ordersResponse.data.orders);
      } catch (err: any) {
        console.error("Profile/Orders Fetch Error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load user data or order history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">Loading profile data...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-xl text-red-600">{error}</div>
    );
  }

  const user = userDetails || authUser;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 border-b pb-2">
        User Profile
      </h1>

      <div className="bg-white shadow-xl rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Account Details
        </h2>
        <p className="mb-2">
          <strong>Name:</strong> {user?.name}
        </p>
        <p className="mb-2">
          <strong>Email:</strong> {user?.email}
        </p>
        <p className="mb-2">
          <strong>Role:</strong>{" "}
          <span className="capitalize">{user?.role}</span>
        </p>
        <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
          Edit Profile (Future Feature)
        </button>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Order History ({orders.length} orders)
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2 border-b pb-2">
                  <p className="font-bold text-lg">
                    Order #{order.orderNumber}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="font-extrabold text-xl text-indigo-700">
                  Total: ${order.totalAmount.toFixed(2)}
                </p>

                <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
                  {order.items.map((item) => (
                    <li key={item.bookId}>
                      {item.title} (x{item.quantity}) - $
                      {(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
