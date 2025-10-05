import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, LogOut, Menu, X, BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";
import { useCart } from "../context/CartContext.js";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { totalItems: cartItemCount } = useCart();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-800 text-white shadow-2xl sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link
            to="/"
            className="flex items-center gap-2 group transition-transform hover:scale-105"
          >
            <BookOpen className="w-8 h-8 md:w-10 md:h-10 group-hover:rotate-12 transition-transform" />
            <span className="text-2xl md:text-3xl font-bold tracking-tight">
              Storynix
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/cart"
              className="relative group p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && isAuthenticated && (
                <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[0.65rem] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Shopping Cart
              </span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-all group"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-all font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-white text-blue-700 hover:bg-gray-100 rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          <div className="flex md:hidden items-center gap-4">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && isAuthenticated && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[0.55rem] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white md:text-xs md:w-5 md:h-5">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-all"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-all font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 hover:bg-white/10 rounded-lg transition-all font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-white font-medium hover:text-blue-300 transition-colors md:hidden"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
