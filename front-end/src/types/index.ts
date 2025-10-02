export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export interface OrderItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  totalPrice: number;
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  orderItems: OrderItem[];
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
  stockQuantity: number;
  images: string[];
}

export interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

export interface PaginatedBooksResponse {
  data: Book[];
  meta: PaginationMeta;
}

export interface SingleBookResponse {
  data: Book;
}

export interface CartItem {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (book: Book, quantity: number) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, newQuantity: number) => void;
  clearCart: () => void;
}
