import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.js";
import { Trash2 } from "lucide-react";

const CartItemRow: React.FC<{ item: any }> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const price = Number(item.price);
  const quantity = item.quantity;
  const itemTotal = (price * quantity).toFixed(2);
  const stockQuantity = item.stockQuantity || 99;

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(event.target.value);
    if (newQuantity >= 1 && newQuantity <= stockQuantity) {
      updateQuantity(item.bookId, newQuantity);
    }
  };

  const handleIncrement = () => {
    if (quantity < stockQuantity) {
      updateQuantity(item.bookId, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(item.bookId, quantity - 1);
    }
  };

  return (
    <div className="flex items-center border-b border-gray-200 py-4 last:border-b-0 transition duration-150 ease-in-out hover:bg-gray-50">
      <div className="w-1/2 flex items-center space-x-4">
        <Link to={`/details/${item.bookId}`}>
          <img
            src={
              item.image ||
              "https://placehold.co/80x120/e5e7eb/6b7280?text=Book"
            }
            alt={item.title}
            className="w-16 h-24 object-cover rounded-lg shadow-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src =
                "https://placehold.co/80x120/e5e7eb/6b7280?text=Book";
            }}
          />
        </Link>
        <div>
          <Link
            to={`/details/${item.bookId}`}
            className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
          >
            {item.title}
          </Link>
          <p className="text-sm text-gray-500">by {item.author || "Unknown"}</p>
        </div>
      </div>

      <div className="w-1/6 text-center text-gray-700 font-medium hidden sm:block">
        ${price.toFixed(2)}
      </div>

      <div className="w-1/6 flex justify-center">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden max-w-[120px]">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max={stockQuantity}
            readOnly
            className="w-10 text-center font-medium border-x border-gray-300 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={handleIncrement}
            disabled={quantity >= stockQuantity}
            className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="w-1/6 flex flex-col sm:flex-row items-center justify-end space-x-4">
        <span className="text-lg font-bold text-gray-900">${itemTotal}</span>
        <button
          onClick={() => removeFromCart(item.bookId)}
          className="p-2 text-red-600 hover:text-red-700 transition-colors rounded-full hover:bg-red-100 active:scale-95"
          title="Remove item"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

const CartPage: React.FC = () => {
  const { cart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center min-h-[80vh]">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 mb-8">
          It looks like you haven't added any books to your cart yet.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors active:scale-95"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const subtotal = totalPrice;
  const tax = 0.08;
  const total = totalPrice * (1 + tax);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 min-h-[80vh]">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-blue-600 inline-block pb-1">
        Shopping Cart ({cart.length} {cart.length === 1 ? "Item" : "Items"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl divide-y divide-gray-100">
          <div className="flex text-sm font-bold text-gray-500 border-b border-gray-200 pb-2 mb-2">
            <span className="w-1/2">Product</span>
            <span className="w-1/6 text-center hidden sm:block">Price</span>
            <span className="w-1/6 text-center">Quantity</span>
            <span className="w-1/6 text-right pr-4">Subtotal</span>
          </div>

          {cart.map((item) => (
            <CartItemRow key={item.bookId} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-2xl shadow-xl h-fit sticky top-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-lg mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-800">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-gray-800">
                ${tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-3">
              <span className="text-xl font-extrabold text-gray-900">
                Order Total
              </span>
              <span className="text-xl font-extrabold text-blue-600">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <Link
            to="/checkout/shipping"
            className="w-full block text-center bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-green-700 transition-colors active:scale-95"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
