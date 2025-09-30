// src/pages/BookDetailsPage.tsx
import React from "react";
import { useParams } from "react-router-dom";

const BookDetailsPage: React.FC = () => {
  // Use the hook to read the dynamic ID from the URL
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-6 text-center py-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Book Details</h1>
      <p className="text-xl text-gray-600">
        You are viewing details for book ID:{" "}
        <span className="font-mono bg-gray-200 px-2 py-1 rounded">
          {id || "..."}
        </span>
      </p>
      <p className="mt-4 text-lg">
        This is where the product information and "Add to Cart" button will go.
      </p>
    </div>
  );
};

export default BookDetailsPage;
