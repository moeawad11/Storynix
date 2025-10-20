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
  isLoggingOut: boolean;
}

export interface OrderItem {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
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
  stockQuantity: number;
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

export interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface DashboardStats {
  totalSales: string;
  totalOrders: number;
  totalUsers: number;
  totalBooks: number;
  recentOrders: Array<{
    id: number;
    totalPrice: number;
    orderStatus: string;
    createdAt: string;
    customerName: string;
  }>;
}
