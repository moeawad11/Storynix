// src/pages/HomePage.tsx
import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 text-center py-20">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">
        Welcome to Storynix Bookstore
      </h1>
      <p className="text-xl text-gray-600">
        Browse our collection of curated books!
      </p>
      <div className="mt-8">
        <p className="text-lg text-gray-800">
          If you're logged in, check out the{" "}
          <a
            href="/profile"
            className="text-blue-500 hover:underline font-semibold"
          >
            Profile link
          </a>{" "}
          in the header.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
