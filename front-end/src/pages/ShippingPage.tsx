import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ArrowLeft, ArrowRight } from "lucide-react";

interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const ShippingPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ShippingFormData>(() => {
    const savedData = sessionStorage.getItem("shippingAddress");
    return savedData
      ? JSON.parse(savedData)
      : {
          fullName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        };
  });

  const [errors, setErrors] = useState<Partial<ShippingFormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingFormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      sessionStorage.setItem("shippingAddress", JSON.stringify(formData));
      navigate("/checkout/payment");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 min-h-[80vh]">
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Cart
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Package className="text-blue-600" size={36} />
          Shipping Information
        </h1>
        <p className="text-gray-600 mt-2">Please enter your delivery details</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Street Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="123 Main Street, Apt 4B"
            />
            {errors.address && (
              <p className="text-red-600 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="New York"
              />
              {errors.city && (
                <p className="text-red-600 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                State *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="NY"
              />
              {errors.state && (
                <p className="text-red-600 text-sm mt-1">{errors.state}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                ZIP Code *
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.zipCode ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="10001"
              />
              {errors.zipCode && (
                <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Country *
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.country ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="United States"
            />
            {errors.country && (
              <p className="text-red-600 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Link
              to="/cart"
              className="flex-1 py-3 px-6 text-center border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Cart
            </Link>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Continue to Payment
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
