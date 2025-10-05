import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.js";
import Footer from "./Footer.js";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-indigo-50">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
