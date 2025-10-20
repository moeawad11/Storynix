import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import {
  BarChart3,
  BookOpen,
  LogOut,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";

const AdminLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      to: "/admin/products",
      label: "Products",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      to: "/admin/orders",
      label: "Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-indigo-700 text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-64 sm:translate-x-0 sm:static flex flex-col`}
      >
        <div className="p-5 text-xl sm:text-2xl font-bold border-b border-indigo-500">
          Storynix Admin
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive ? "bg-indigo-500" : "hover:bg-indigo-600"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-500">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 mb-2 text-gray-800 hover:bg-gray-100 rounded-lg transition font-medium"
          >
            ← Back to Store
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium justify-center"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </header>

        <section className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen overflow-x-hidden">
          <div className="w-full">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
