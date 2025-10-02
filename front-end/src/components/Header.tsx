import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import { useCart } from "../context/CartContext.js";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const { totalItems: cartItemCount } = useCart();

  const userName = user?.firstName?.split(" ")[0] || "Profile";
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
              className="hover:text-blue-200 block md:inline-block"
              onClick={() => setIsMenuOpen(false)}
            >
              Hi, {userName}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 block md:inline-block w-full md:w-auto mt-2 md:mt-0"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-blue-300 hover:bg-gray-700 transition-colors block md:inline-block px-4 py-3 md:py-0 md:px-0 rounded-md md:rounded-none text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 transition-colors block md:inline-block px-4 py-3 md:py-2 md:px-4 rounded-md font-medium text-sm"
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
    <header className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="px-4 md:px-6 py-3 flex justify-between">
        <Link to="/" className="text-2xl font-extrabold hover:text-gray-300">
          Storynix
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/cart" className="relative hover:text-gray-300 text-xl">
            🛒
            {cartItemCount >= 0 && (
              <span className="absolute -top-3 -right-3 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold border-2 border-gray-800">
                {cartItemCount}
              </span>
            )}
          </Link>
          <NavLinks />
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <Link to="/cart" className="relative hover:text-gray-300 text-xl">
            🛒
            {cartItemCount >= 0 && (
              <span className="absolute -top-3 -right-3 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold border-2 border-gray-800">
                {cartItemCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-xl p-2 hover:bg-gray-700 rounded"
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
