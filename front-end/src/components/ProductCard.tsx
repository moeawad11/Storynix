import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Book } from "../types/index.js";

interface ProductCardProps {
  book: Book;
}

const ProductCard: React.FC<ProductCardProps> = ({ book }) => {
  const { imageUrl, isAvailable, formattedPrice } = useMemo(() => {
    return {
      imageUrl:
        book.images?.[0] ||
        "https://placehold.co/300x450/e5e7eb/6b7280?text=No+Cover",
      isAvailable: book.stockQuantity > 0,
      formattedPrice: Number(book.price).toFixed(2),
    };
  }, [book]);

  return (
    <Link
      to={`/books/${book.id}`}
      className="flex flex-col h-full block bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1 group"
      aria-label={`View details for ${book.title}`}
    >
      <div className="h-56 sm:h-66 md:h-72 lg:h-80 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src =
              "https://placehold.co/300x450/e5e7eb/6b7280?text=No+Cover";
          }}
        />
        <div
          className={`absolute top-0 right-0 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg shadow-md ${isAvailable ? "bg-green-600" : "bg-red-600"}`}
        >
          {isAvailable ? "In Stock" : "Out of Stock"}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 transition-colors duration-300 group-hover:text-blue-600">
            {book.title}
          </h3>
          <p className="text-sm text-gray-500 font-medium line-clamp-1">
            By {book.author}
          </p>
        </div>

        <div className="mt-3 flex justify-between items-center gap-3 md:gap-4">
          <span className="text-sm sm:text-base font-extrabold text-green-600">
            ${formattedPrice}
          </span>
          <span className="text-xs text-gray-400">
            {book.stockQuantity > 0
              ? `${book.stockQuantity} available`
              : "Sold Out"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
