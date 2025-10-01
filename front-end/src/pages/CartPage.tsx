import React from "react";

const CartPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 text-center py-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
      <p className="text-xl text-gray-600">
        This page confirms the{" "}
        <span className="font-semibold text-red-500">ProtectedRoute</span> is
        working!
      </p>
      <p className="mt-4 text-lg">
        If you see this, you are successfully authenticated.
      </p>
    </div>
  );
};

export default CartPage;
