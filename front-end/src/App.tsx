import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import HomePage from "./pages/HomePage.js";
import LoginPage from "./pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import BookDetailsPage from "./pages/BookDetailsPage.js";
import CartPage from "./pages/CartPage.js";
import ProfilePage from "./pages/ProfilePage.js";
import ShippingPage from "./pages/ShippingPage.js";
import EditProfilePage from "./pages/EditProfilePage.js";
import PaymentPage from "./pages/PaymentPage.js";
import OrderSuccessPage from "./pages/OrderSuccessPage.js";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="books/:id" element={<BookDetailsPage />} />

        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile/edit"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="checkout/shipping"
          element={
            <ProtectedRoute>
              <ShippingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="checkout/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders/:id/success"
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <div className="text-center py-20">
              <h2 className="text-5xl font-bold text-red-600">404</h2>
              <p className="text-xl mt-3">Page Not Found</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
