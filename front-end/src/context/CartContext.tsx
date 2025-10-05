import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Book, CartItem, CartContextType } from "../types/index.js";
import api from "../api/axios.js";
import { useAuth } from "./AuthContext.js";

const initialState: CartContextType = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: () => {},
};

export const CartContext = createContext<CartContextType>(initialState);

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        const mappedCart = res.data.map((item: any) => ({
          bookId: item.book.id,
          title: item.book.title,
          price: item.book.price,
          quantity: item.quantity,
          stockQuantity: item.book.stockQuantity,
          author: item.book.author,
          image: item.book.image,
        }));
        setCart(mappedCart);
      } catch (err) {
        console.error("Error fetching cart", err);
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  const addToCart = useCallback(
    async (book: Book, quantityToAdd: number = 1) => {
      try {
        const res = await api.post("/cart/add", {
          bookId: book.id,
          quantity: quantityToAdd,
        });
        console.log(res.data);
        const newItem = res.data.cartItem;
        setCart((prev) => {
          const existingItem = prev.find(
            (item) => item.bookId === newItem.bookId
          );
          if (existingItem) {
            return prev.map((item) =>
              item.bookId === book.id
                ? { ...item, quantity: item.quantity + quantityToAdd }
                : item
            );
          } else {
            return [...prev, newItem];
          }
        });
      } catch (err: any) {
        console.error(err.response?.data?.message || "Error adding to cart");
      }
    },
    []
  );

  const removeFromCart = useCallback(async (bookId: number) => {
    try {
      await api.delete(`/cart/${bookId}`);
      setCart((prev) => prev.filter((item) => item.bookId !== bookId));
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  }, []);

  const updateQuantity = useCallback(
    async (bookId: number, newQuantity: number) => {
      try {
        await api.put("/cart/update", { bookId, quantity: newQuantity });
        setCart((prev) =>
          prev.map((item) =>
            item.bookId === bookId ? { ...item, quantity: newQuantity } : item
          )
        );
      } catch (err: any) {
        console.error(err.response?.data?.message || "Error updating cart");
      }
    },
    []
  );

  const clearCart = useCallback(async () => {
    try {
      await api.delete("/cart/clear");
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
      throw err;
    }
  }, []);

  const { totalItems, totalPrice } = useMemo(() => {
    const items = cart.reduce((sum, item) => sum + item.quantity, 0);
    const price = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return { totalItems: items, totalPrice: price };
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      cart,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
