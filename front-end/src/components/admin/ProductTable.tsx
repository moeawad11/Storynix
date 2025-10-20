import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import api from "../../api/axios.js";
import { Book } from "../../types/index.js";
import { Link } from "react-router-dom";

interface AdminBook extends Book {
  createdAt: string;
  updatedAt: string;
}

interface ProductTableProps {
  books: AdminBook[];
  onRefresh: () => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ books, onRefresh }) => {
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.delete(`/admin/books/${id}`);
      onRefresh();
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("Failed to delete book");
    }
  };

  if (books.length === 0)
    return <p className="text-center text-gray-600">No books found.</p>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="bg-indigo-600 text-white text-sm">
            <th className="p-3">ID</th>
            <th className="p-3">Title</th>
            <th className="p-3">Author</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Created</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr
              key={book.id}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <td className="p-3">{book.id}</td>
              <td className="p-3 font-medium">{book.title}</td>
              <td className="p-3">{book.author}</td>
              <td className="p-3">${Number(book.price).toFixed(2)}</td>
              <td className="p-3">{book.stockQuantity}</td>
              <td className="p-3 text-sm text-gray-500">
                {new Date(book.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3 flex items-center justify-center gap-3">
                <Link
                  to={`/admin/products/new?id=${book.id}`}
                  className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition"
                  title="Edit"
                >
                  <Pencil className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
