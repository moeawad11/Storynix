import React, { useState, useEffect, useReducer, useRef, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { CreditCard, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext.js";
import { useAuth } from "../context/AuthContext.js";
import api from "../api/axios.js";
import { getShippingAddress } from "../utils/storage.js";

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CardDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart: cartFromContext, totalPrice: totalPriceFromContext } =
    useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const buyNowItem = location.state?.buyNowItem || null;
  const isBuyNow = !!buyNowItem;

  const cart = useMemo(() => {
    if (isBuyNow && buyNowItem) {
      return [buyNowItem];
    }
    return cartFromContext;
  }, [isBuyNow, buyNowItem, cartFromContext]);

  const totalPrice =
    isBuyNow && buyNowItem
      ? buyNowItem.price * buyNowItem.quantity
      : totalPriceFromContext;

  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<Partial<CardDetails>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const orderInitializing = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isBuyNow && !buyNowItem) {
      navigate("/");
      return;
    }

    if (!isBuyNow && cart.length === 0) {
      navigate("/cart");
      return;
    }

    const savedAddress = getShippingAddress();
    if (!savedAddress) {
      navigate("/checkout/shipping");
      return;
    }

    setShippingAddress(savedAddress);
  }, [isAuthenticated, cart, navigate, buyNowItem, isBuyNow]);

  useEffect(() => {
    const initializeOrder = async () => {
      if (!shippingAddress || orderCreated || orderInitializing.current) return;

      orderInitializing.current = true;
      try {
        const orderItems = cart.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
        }));

        const response = await api.post("/orders", {
          orderItems,
          shippingAddress,
          paymentMethod: "Card",
        });

        setOrderId(response.data.orderId);
        setOrderCreated(true);
      } catch (err: any) {
        console.error("Error creating order:", err);
        setErrorMessage(
          err.response?.data?.message || "Failed to initialize order"
        );
        orderInitializing.current = false;
      }
    };

    initializeOrder();
  }, [shippingAddress, orderCreated]);

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    }

    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
    }

    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setCardDetails((prev) => ({ ...prev, [name]: formattedValue }));

    if (errors[name as keyof CardDetails]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateCardDetails = (): boolean => {
    const newErrors: Partial<CardDetails> = {};

    const cardNumberClean = cardDetails.cardNumber.replace(/\s/g, "");
    if (!cardNumberClean) {
      newErrors.cardNumber = "Card number is required";
    } else if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
      newErrors.cardNumber = "Invalid card number";
    }

    if (!cardDetails.cardName.trim()) {
      newErrors.cardName = "Cardholder name is required";
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!cardDetails.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!expiryRegex.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = "Invalid format (MM/YY)";
    } else {
      const [month, year] = cardDetails.expiryDate.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      if (expiry < now) newErrors.expiryDate = "Card has expired";
    }

    if (!cardDetails.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (cardDetails.cvv.length < 3) {
      newErrors.cvv = "Invalid CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCardDetails()) return;
    if (!orderId) {
      setErrorMessage("Order not initialized. Please try again.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const response = await api.post(`/orders/${orderId}/payment`);

      console.log("Payment processed:", response.data);

      navigate(`/orders/${orderId}/success`, {
        state: { order: response.data.order, isBuyNow },
      });
    } catch (err: any) {
      console.error("Payment error:", err);
      setErrorMessage(
        err.response?.data?.message || "Payment failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!shippingAddress) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600">Loading payment information...</p>
      </div>
    );
  }

  if (!orderCreated && shippingAddress) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Initializing your order...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 min-h-[80vh]">
      <div className="mb-8">
        <Link
          to="/checkout/shipping"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Shipping
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <CreditCard className="text-blue-600" size={36} />
          Payment Details
        </h1>
        <p className="text-gray-600 mt-2">Complete your secure payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle
                  className="text-red-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <p className="text-red-800 text-sm">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Card Number *
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardInputChange}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cardNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isProcessing}
                />
                {errors.cardNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cardName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={cardDetails.cardName}
                  onChange={handleCardInputChange}
                  placeholder="JOHN DOE"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cardName ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isProcessing}
                />
                {errors.cardName && (
                  <p className="text-red-600 text-sm mt-1">{errors.cardName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardInputChange}
                    placeholder="MM/YY"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.expiryDate ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isProcessing}
                  />
                  {errors.expiryDate && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    CVV *
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    placeholder="123"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.cvv ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isProcessing}
                  />
                  {errors.cvv && (
                    <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Lock
                  className="text-blue-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Secure Payment
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Your payment information is encrypted and secure.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Link
                  to="/checkout/shipping"
                  className="flex-1 py-3 px-6 text-center border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Shipping
                </Link>
                <button
                  type="submit"
                  disabled={isProcessing || !orderCreated}
                  className="flex-1 py-3 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Pay ${totalPrice.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.bookId} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Shipping Address
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {shippingAddress.fullName}
                </p>
                <p>{shippingAddress.address}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.zipCode}
                </p>
                <p>{shippingAddress.country}</p>
                <p className="pt-2">{shippingAddress.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
