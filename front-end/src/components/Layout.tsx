import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.js";
import Footer from "./Footer.js";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
