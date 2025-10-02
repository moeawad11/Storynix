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

const getLocalCart = (): CartItem[] => {
  try {
    const localData = localStorage.getItem("cart");
    return localData ? JSON.parse(localData) : [];
  } catch (err) {
    console.error("Error loading cart from localStorage", err);
    return [];
  }
};

const saveLocalCart = (cart: CartItem[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (err) {
    console.error("Error saving cart to localStorage", err);
  }
};

const initialState: CartContextType = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
};

export const CartContext = createContext<CartContextType>(initialState);

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCart(getLocalCart());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveLocalCart(cart);
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((book: Book, quantityToAdd: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.bookId === book.id
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantityToAdd;
        return newCart;
      } else {
        const newItem: CartItem = {
          bookId: book.id,
          title: book.title,
          price: book.price,
          quantity: quantityToAdd,
        };
        return [...prevCart, newItem];
      }
    });
  }, []);

  const removeFromCart = useCallback((bookId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.bookId !== bookId));
  }, []);

  const updateQuantity = useCallback((bookId: number, newQuantity: number) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.bookId !== bookId);
      }

      const newCart = prevCart.map((item) =>
        item.bookId === bookId ? { ...item, quantity: newQuantity } : item
      );

      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
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
