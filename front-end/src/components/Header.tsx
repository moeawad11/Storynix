import React, { useState } from "react";
import { Link } from "react-router-dom";
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

  const NavLinks = () => {
    return (
      <>
        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              className="md:hidden hover:text-blue-300 hover:bg-gray-700 transition-colors block px-4 py-3 rounded-md text-base sm:text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>

            <Link
              to="/profile"
              className="relative hidden md:flex items-center text-2xl group hover:text-blue-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              👤
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Profile
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="md:hidden text-left bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-3 rounded-md text-base sm:text-lg"
            >
              Logout
            </button>

            <button
              onClick={handleLogout}
              className="hidden md:inline-block bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-2 rounded-md text-base sm:text-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-blue-300 hover:bg-gray-700 transition-colors block md:inline-block px-4 py-3 md:py-0 md:px-0 rounded-md md:rounded-none text-base sm:text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 transition-colors block md:inline-block px-4 py-3 md:py-2 md:px-4 rounded-md font-medium text-base sm:text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Register
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg sticky top-0 z-50 p-4">
      <div className="px-4 md:px-8 py-3 flex justify-between">
        <Link
          to="/"
          className="text-3xl sm:text-4xl font-extrabold hover:text-gray-300"
        >
          Storynix
        </Link>

        <div className="hidden md:flex space-x-6 items-center gap-x-1">
          <Link
            to="/cart"
            className="relative group hover:text-gray-300 text-xl sm:text-2xl"
          >
            🛒
            {cartItemCount >= 0 && isAuthenticated && (
              <span className="absolute -top-3 -right-3 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold border-2 border-gray-800">
                {cartItemCount}
              </span>
            )}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Cart
            </span>
          </Link>
          <NavLinks />
        </div>

        <div className="group md:hidden flex items-center space-x-4">
          <Link to="/cart" className="relative hover:text-gray-300 text-2xl">
            🛒
            {cartItemCount >= 0 && isAuthenticated && (
              <span className="absolute -top-3 -right-3 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold border-2 border-gray-800">
                {cartItemCount}
              </span>
            )}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Cart
            </span>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-xl sm:text-2xl p-2 hover:bg-gray-700 rounded"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden ${isMenuOpen ? "block" : "hidden"} mt-3 border-t border-gray-700 pt-3`}
      >
        <div className="flex flex-col space-y-3">
          <NavLinks />
        </div>
      </div>
    </header>
  );
};

export default Header;
