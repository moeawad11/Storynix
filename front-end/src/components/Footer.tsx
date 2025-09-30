import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-center p-4 mt-auto">
      <div className="container text-white">
        <p>
          &copy; {new Date().getFullYear()} Storynix BookStore. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
