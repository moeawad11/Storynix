import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-center py-5 md:py-6 mt-auto">
      <div className="container text-white py-2">
        <p className="text-xs sm:text-sm md:text-base lg:text-lg">
          &copy; {new Date().getFullYear()} Storynix BookStore. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
