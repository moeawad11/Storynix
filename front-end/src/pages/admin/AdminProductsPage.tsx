import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import ProductTable from "../../components/admin/ProductTable.js";
import { Link } from "react-router-dom";

const AdminProductsPage: React.FC = () => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data.data);
    } catch (err) {
      console.error("Error loading books", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Books</h2>
        <Link
          to="/admin/products/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add Book
        </Link>
      </div>
      <ProductTable books={books} onRefresh={fetchBooks} />
    </div>
  );
};

export default AdminProductsPage;
