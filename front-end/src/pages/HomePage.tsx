import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "../components/ProductCard.js";
import api from "../api/axios.js";
import {
  Book,
  PaginatedBooksResponse,
  PaginationMeta,
} from "../types/index.js";
import { Search } from "lucide-react";

const DEFAULT_ITEMS_PER_PAGE = 10;

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchBooks = useCallback(async (search: string, page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/books", {
        params: { search, page, limit: DEFAULT_ITEMS_PER_PAGE },
      });

      const { data, meta } = response.data as PaginatedBooksResponse;

      setBooks(data);
      setPagination(meta);
    } catch (err: any) {
      console.error("Fetch Books Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load products. Please try again later."
      );
      setBooks([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pagination.currentPage) {
      fetchBooks(debouncedSearchTerm, pagination.currentPage);
    }
  }, [debouncedSearchTerm, pagination.currentPage, fetchBooks]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-[80vh]">
      <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-800 mb-6 border-b pb-2">
        <span className="text-blue-600">📚</span> Storynix Catalog
      </h1>

      <div className="mb-8 max-w-xl mx-auto relative">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-5 py-3 border-2 border-gray-300 rounded-full shadow-inner focus:outline-none focus:border-blue-500 transition-all"
          disabled={loading}
        />
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      {loading && (
        <div className="text-center py-20 text-xl text-gray-600">
          Loading books...
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-xl text-red-600 bg-red-100 p-4 rounded-lg">
          {error}
        </div>
      )}

      {!loading && books.length === 0 && !error && (
        <div className="text-center py-20 text-xl text-gray-500">
          No books found matching "{searchTerm}".
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
        {books.map((book) => (
          <ProductCard key={book.id} book={book} />
        ))}
      </div>

      {!loading && books.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-12">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md w-full sm:w-auto"
          >
            Previous Page
          </button>
          <span className="text-gray-700 font-semibold text-lg">
            Page {pagination.currentPage} of {pagination.totalPages}
            <span className="text-sm text-gray-500 ml-2">
              ({pagination.totalItems} total items)
            </span>
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md w-full sm:w-auto"
          >
            Next Page
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
