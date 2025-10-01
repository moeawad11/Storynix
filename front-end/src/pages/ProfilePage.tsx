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
        console.log(ordersResponse.data.orders);
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
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-800 border-b-4 border-blue-100 pb-2">
        <span className="text-blue-600">👤</span> User Profile
      </h1>

      <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl p-8 mb-10">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-100">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xl">👤</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Account Details
          </h2>
        </div>

        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold text-gray-800">Name:</span>{" "}
            {user?.firstName + " " + user?.lastName}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Email:</span>{" "}
            {user?.email}
          </p>
        </div>

        <button className="mt-6 bg-gray-600 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition shadow-md">
          Edit Profile (Coming Soon)
        </button>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-100">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xl">📦</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Order History
            <span className="ml-2 text-lg font-normal text-gray-500">
              ({orders.length} {orders.length === 1 ? "order" : "orders"})
            </span>
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">
              You haven't placed any orders yet.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Start shopping to see your orders here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 bg-white"
              >
                <div className="flex justify-between items-start sm:items-center bg-gray-50 px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
                    <span className="text-gray-400 text-xs sm:text-sm font-medium">
                      ORDER
                    </span>
                    <h3 className="font-bold text-lg sm:text-xl text-gray-800">
                      #{order.id}
                    </h3>
                  </div>
                  <span
                    className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : order.orderStatus === "Shipped"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : order.orderStatus === "Cancelled"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="px-4 sm:px-6 py-3 sm:py-5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-0">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">
                        Order Date
                      </p>
                      <p className="text-gray-800 font-medium text-sm sm:text-base">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">
                        Total Amount
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-blue-600">
                        ${Number(order.totalPrice)?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 sm:pt-4">
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 sm:mb-3">
                      Order Items
                    </p>
                    <ul className="space-y-1 sm:space-y-2">
                      {order.orderItems?.map((item) => (
                        <li
                          key={item.bookId}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base"
                        >
                          <span className="text-gray-700 mb-1 sm:mb-0">
                            <span className="font-medium text-xs sm:text-base">
                              {item.title}
                            </span>
                            <span className="text-gray-500 text-xs sm:text-sm ml-1 sm:ml-2">
                              × {item.quantity}
                            </span>
                          </span>
                          <span className="font-semibold text-gray-800 text-xs sm:text-base">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
