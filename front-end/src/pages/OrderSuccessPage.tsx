import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Home,
  FileText,
  Mail,
  Truck,
} from "lucide-react";
import { useCart } from "../context/CartContext.js";
import { clearShippingAddress } from "../utils/storage.js";

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { clearCart } = useCart();
  const order = location.state?.order;
  const isBuyNow = location.state?.isBuyNow;

  useEffect(() => {
    if (!order) {
      navigate("/profile");
      return;
    }

    if (!isBuyNow) clearCart();

    clearShippingAddress();
  }, [clearCart, order, navigate]);

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-5">
            <CheckCircle className="text-green-600" size={72} />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Order Placed Successfully!
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Thank you for your purchase
        </p>
        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
          <Package size={18} className="text-gray-600" />
          <p className="text-sm font-semibold text-gray-700">Order #{id}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FileText size={24} />
          Order Summary
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${Number(order.totalPrice)?.toFixed(2)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Payment Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-lg font-semibold text-green-600">
                  {order.isPaid ? "Paid" : "Pending"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Order Status</p>
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-blue-600" />
              <p className="text-lg font-semibold text-blue-600">
                {order.orderStatus || "Processing"}
              </p>
            </div>
          </div>

          {order.orderItems && order.orderItems.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Items Ordered ({order.orderItems.length})
              </p>
              <div className="space-y-2">
                {order.orderItems.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-700">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex items-start gap-3 mb-4">
          <Mail className="text-blue-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>A confirmation email has been sent to your inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Your order is being prepared for shipment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Track your order anytime from your profile page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>You'll receive shipping updates via email</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/profile"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <FileText size={20} />
          View My Orders
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Home size={20} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
