import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { Book, SingleBookResponse } from "../types/index.js";
import { ShoppingCart, Package } from "lucide-react";

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  const bookId = parseInt(id || "", 10);
  const imageUrl =
    book?.images?.[0] ||
    "https://placehold.co/400x600/e5e7eb/6b7280?text=No+Cover";
  const isAvailable = (book?.stockQuantity || 0) > 0;

  useEffect(() => {
    if (isNaN(bookId) || bookId <= 0) {
      setError("Invalid book ID provided.");
      setLoading(false);
      return;
    }

    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      setBook(null);
      try {
        const response = await api.get(`/books/${bookId}`);
        const { data } = response.data as SingleBookResponse;

        setBook(data);
        setQuantity(Math.min(1, data.stockQuantity));
      } catch (err: any) {
        console.error("Fetch Book Details Error:", err);
        setError(err.response?.data?.message || "Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleAddToCart = async () => {
    if (!book || quantity <= 0) return;

    setCartMessage("Adding to cart...");

    try {
      await api.post("/cart/add", {
        bookId: book.id,
        quantity: quantity,
      });
      setCartMessage(
        `✅ Successfully added ${quantity} x ${book.title} to cart!`
      );
      setTimeout(() => setCartMessage(null), 3000);
    } catch (err: any) {
      console.error("Add to Cart Error:", err);
      setCartMessage("❌ Failed to add to cart. You may need to log in.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        Loading book details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-xl text-red-600 bg-red-100 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20 text-xl text-gray-500">
        Book data is unavailable.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 min-h-[85vh]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white shadow-2xl rounded-2xl p-8 md:p-12">
        <div className="flex justify-center items-start">
          <img
            src={imageUrl}
            alt={`Cover of ${book.title}`}
            className="w-72 sm:w-80 lg:w-96 max-h-[600px] object-cover rounded-2xl shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src =
                "https://placehold.co/400x600/e5e7eb/6b7280?text=No+Cover";
            }}
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              {book.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              by{" "}
              <span className="text-blue-700 font-semibold">{book.author}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-y border-gray-200 py-5 mb-8">
            <p className="text-3xl md:text-4xl font-extrabold text-green-700">
              ${Number(book.price).toFixed(2)}
            </p>
            <div className="flex items-center space-x-2">
              <Package className="text-gray-500" size={20} />
              <span
                className={`text-sm font-semibold px-4 py-1 rounded-full ${
                  isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isAvailable
                  ? `In Stock: ${book.stockQuantity}`
                  : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              About this book
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {book.description || "No description provided."}
            </p>
          </div>

          <div className="flex flex-col gap-y-3 gap-x-6 text-sm text-gray-600 bg-gray-50 mb-10 rounded-xl p-2">
            <p className="text-xs md:text-sm">
              <span className="text-sm md:text-base font-semibold text-gray-800">
                ISBN:
              </span>{" "}
              {book.isbn}
            </p>
            <p className="text-xs md:text-sm">
              <span className="text-sm md:text-base font-semibold text-gray-800">
                Book ID:
              </span>{" "}
              {book.id}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-auto max-w-fit max-h-fit">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="h-full px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors font-semibold"
                disabled={quantity <= 1 || !isAvailable}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                min="1"
                max={book.stockQuantity}
                readOnly
                className="w-16 text-center font-medium border-x border-gray-300 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() =>
                  setQuantity((prev) => Math.min(book.stockQuantity, prev + 1))
                }
                className="h-full px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors font-semibold"
                disabled={quantity >= book.stockQuantity || !isAvailable}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`flex-grow py-3 px-6 text-lg font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 ${
                isAvailable
                  ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                  : "bg-gray-300 text-gray-700 cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={20} />
              <span>{isAvailable ? "Add to Cart" : "Sold Out"}</span>
            </button>
          </div>

          {cartMessage && (
            <div className="mt-6 p-4 rounded-lg text-center font-medium bg-blue-100 text-blue-700 transition duration-300">
              {cartMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
